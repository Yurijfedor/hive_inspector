import {ConversationFlow} from './conversationFlow';

export function getStep<TSession, TStepId extends string>(
  flow: ConversationFlow<TSession, TStepId>,
  index: number,
) {
  return flow.steps[index];
}

export function isLastStep<TSession, TStepId extends string>(
  flow: ConversationFlow<TSession, TStepId>,
  index: number,
) {
  return index >= flow.steps.length - 1;
}

export function isFlowFinished<TSession, TStepId extends string>(
  flow: ConversationFlow<TSession, TStepId>,
  session: {stepIndex: number},
) {
  return session.stepIndex >= flow.steps.length;
}
