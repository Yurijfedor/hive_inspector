import {ConversationDriver} from '../../conversation/driver/conversationDriver';
import {getFlow} from '../../conversation/registry/flowRegistry';
import {resolveStep, executeStep} from '../../flows/flowRuntime';
import {mapFlowEffectToEvent} from '../../domain/mappers/mapFlowEffectToEvent';
import {handleDomainEvent} from '../../domain/handlers/handleDomainEvent';

export async function runSingleFlow(
  driver: ConversationDriver,
  flowName: string,
  hiveNumber: number,
  data: Record<string, any>,
) {
  const flow = getFlow(flowName);
  if (!flow) {
    throw new Error(`Flow not found: ${flowName}`);
  }

  let session = flow.createSession(hiveNumber);

  session = await (driver as any).injectHiveContext?.(flowName, session, [
    hiveNumber,
  ]);

  while (true) {
    const resolved = resolveStep(flow, session);
    if (!resolved) break;

    const {step, index} = resolved;

    // CONFIRM AUTO
    if (step.id.startsWith('CONFIRM')) {
      const result = executeStep(step, session, 'так');

      if (result.type === 'RETRY') {
        throw new Error(result.message);
      }

      session = result.session;
      session.stepIndex = index + 1;

      await emitEffects(driver, result);
      continue;
    }

    // VALUE RESOLVER
    const value = resolveValue(step.id, data);

    // 🔥 SKIP EMPTY
    if (value === undefined || value === null || value === '') {
      session.stepIndex = index + 1;
      continue;
    }

    const result = executeStep(step, session, value);

    if (result.type === 'RETRY') {
      throw new Error(result.message);
    }

    session = result.session;
    session.stepIndex = index + 1;

    await emitEffects(driver, result);
  }
}

function resolveValue(stepId: string, data: Record<string, any>) {
  return data[stepId];
}

async function emitEffects(driver: any, result: any) {
  if (!result.effects?.length) return;

  for (const effect of result.effects) {
    driver.bus.emit({type: 'FLOW_EFFECT', effect});

    const domainEvent = mapFlowEffectToEvent(effect);

    if (domainEvent) {
      await handleDomainEvent(driver.userId, domainEvent);
    }
  }
}
