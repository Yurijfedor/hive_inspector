import {ConversationFlow, StepDefinition, StepResult} from './conversationFlow';

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

  const updated = step.apply(session, value);

  // effects генеруються
  const effects = step.afterAccept ? step.afterAccept(updated, value) : [];

  const runtimeEffects = step.runtimeEffects
    ? step.runtimeEffects(updated, value)
    : [];

  return {
    type: 'ACCEPT',
    session: updated,
    effects,
    runtimeEffects,
  };
}
