import {ConversationFlow, StepDefinition, StepResult} from './conversationFlow';
import {FlowEffect, RuntimeEffect} from '../conversation/types';
/**
 * Отримати поточний step
 */
export function getStep<TSession>(
  flow: ConversationFlow<TSession>,
  index: number,
): StepDefinition<TSession> {
  return flow.steps[index];
}

/**
 * Чи це останній step
 */
export function isLastStep<TSession>(
  flow: ConversationFlow<TSession>,
  index: number,
): boolean {
  return index >= flow.steps.length - 1;
}

/**
 * Чи flow завершено
 */
export function isFlowFinished<TSession>(
  flow: ConversationFlow<TSession>,
  session: {stepIndex: number},
): boolean {
  return session.stepIndex >= flow.steps.length;
}

/**
 * Виконати step
 */
export function executeStep<TSession>(
  step: StepDefinition<TSession>,
  session: TSession,
  rawValue: unknown,
): StepResult<TSession> {
  const value = step.normalize ? step.normalize(rawValue) : rawValue;

  if (step.validate && !step.validate(value)) {
    return {
      type: 'RETRY',
      message:
        step.retryMessage ?? 'Я не зрозумів відповідь. Повторіть, будь ласка.',
    };
  }

  const applyResult = step.apply(session, value);

  let updated: TSession;
  let applyEffects: FlowEffect[] = [];
  let applyRuntimeEffects: RuntimeEffect[] = [];

  if (
    typeof applyResult === 'object' &&
    applyResult !== null &&
    'session' in applyResult
  ) {
    updated = applyResult.session;
    applyEffects = applyResult.effects ?? [];
    applyRuntimeEffects = applyResult.runtimeEffects ?? [];
  } else {
    updated = applyResult;
  }

  // effects генеруються
  let effects: FlowEffect[] = [...applyEffects];
  let runtimeEffects: RuntimeEffect[] = [...applyRuntimeEffects];
  // -------------------------
  // AFTER ACCEPT
  // -------------------------

  if (step.afterAccept) {
    const result = step.afterAccept(updated, value);

    if (Array.isArray(result)) {
      effects = [...effects, ...result];
    } else if (result) {
      effects = [...effects, ...(result.effects ?? [])];
      runtimeEffects = [...runtimeEffects, ...(result.runtimeEffects ?? [])];
    }
  }

  // -------------------------
  // STEP RUNTIME EFFECTS (старий механізм)
  // -------------------------

  if (step.runtimeEffects) {
    const stepRuntime = step.runtimeEffects(updated, value);
    runtimeEffects = [...runtimeEffects, ...stepRuntime];
  }

  return {
    type: 'ACCEPT',
    session: updated,
    effects,
    runtimeEffects,
  };
}

export function getNextStep<TSession>(
  flow: ConversationFlow<TSession>,
  session: TSession & {stepIndex: number},
  context: any,
): {step: StepDefinition<TSession>; index: number} | null {
  let index = session.stepIndex;

  while (index < flow.steps.length) {
    const step = flow.steps[index];

    if (step.shouldSkip?.(session, context)) {
      index++;
      continue;
    }

    return {step, index};
  }

  return null;
}

export function resolveStep<TSession>(
  flow: ConversationFlow<TSession>,
  session: TSession & {stepIndex: number},
  context: any = {},
): {step: StepDefinition<TSession>; index: number} | null {
  let index = session.stepIndex;

  while (index < flow.steps.length) {
    const step = flow.steps[index];

    if (step.shouldSkip?.(session, context)) {
      index++;
      continue;
    }

    return {step, index};
  }

  return null;
}
