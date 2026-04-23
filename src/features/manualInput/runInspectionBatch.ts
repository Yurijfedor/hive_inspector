import {ConversationDriver} from '../../conversation/driver/conversationDriver';
import {InspectionFormUI} from './types';

import {getFlow} from '../../conversation/registry/flowRegistry';
import {resolveStep, executeStep} from '../../flows/flowRuntime';
import {mapFlowEffectToEvent} from '../../domain/mappers/mapFlowEffectToEvent';
import {handleDomainEvent} from '../../domain/handlers/handleDomainEvent';

export async function runInspectionBatch(
  driver: ConversationDriver,
  hiveNumber: number,
  data: InspectionFormUI,
) {
  const flow = getFlow('inspection');
  if (!flow) {
    throw new Error('inspection flow not found');
  }

  // 🔥 1. створюємо session
  let session = flow.createSession(hiveNumber);

  // 🔥 2. інжектимо контекст (як у driver)
  // ⚠️ приватний метод → доступ через any
  session = await (driver as any).injectHiveContext?.('inspection', session, [
    hiveNumber,
  ]);

  // 🔥 3. крутимо flow
  while (true) {
    const resolved = resolveStep(flow, session);
    if (!resolved) break;

    const {step, index} = resolved;

    // ----------------------------------
    // 🔥 AUTO CONFIRM
    // ----------------------------------
    if (step.id.startsWith('CONFIRM')) {
      const result = executeStep(step, session, 'так');

      if (result.type === 'RETRY') {
        throw new Error(result.message);
      }

      session = result.session;
      session.stepIndex = index + 1;

      // effects
      await emitEffects(driver, result);

      continue;
    }

    // ----------------------------------
    // 🔥 VALUE MAPPING
    // ----------------------------------
    let value: unknown;

    switch (step.id) {
      case 'STRENGTH':
        value = data.strength;
        break;

      case 'BROOD':
        value = data.broodFrames;
        break;

      case 'QUEEN':
        value = data.queen;
        break;

      case 'QUEEN_BREED':
        value = data.queenBreed;
        break;

      case 'QUEEN_YEAR':
        value = data.queenYear;
        break;

      case 'HONEY':
        value = data.honeyKg;
        break;

      default:
        throw new Error(`Unhandled step: ${step.id}`);
    }

    // ----------------------------------
    // 🔥 SAFETY: якщо step НЕ skip-нувся,
    // але значення нема → це баг форми
    // ----------------------------------
    if (value === undefined || value === null) {
      throw new Error(`Missing value for step ${step.id}`);
    }

    const result = executeStep(step, session, value);

    if (result.type === 'RETRY') {
      throw new Error(result.message);
    }

    session = result.session;
    session.stepIndex = index + 1;

    // ----------------------------------
    // 🔥 EFFECTS (як у driver)
    // ----------------------------------
    await emitEffects(driver, result);
  }

  // ----------------------------------
  // 🔥 ФІНАЛІЗАЦІЯ (як у driver)
  // ----------------------------------
  (driver as any).state = {mode: 'IDLE'};
  await (driver as any).persistence.clear();

  (driver as any).bus.emit({
    type: 'SYSTEM_SPEAK',
    text: 'Готовий до нової команди.',
  });

  (driver as any).bus.emit({type: 'CONVERSATION_FINISHED'});
}

async function emitEffects(driver: any, result: any) {
  if (!result.effects?.length) return;

  for (const effect of result.effects) {
    // UI / debug
    driver.bus.emit({type: 'FLOW_EFFECT', effect});

    const domainEvent = mapFlowEffectToEvent(effect);

    if (domainEvent) {
      // 🔥 ВАЖЛИВО — напряму викликаємо handler
      await handleDomainEvent(driver.userId, domainEvent);
    }
  }
}
