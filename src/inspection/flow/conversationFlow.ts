/**
 * Function that applies user answer to session
 */
export type StepHandler<TSession> = (
  session: TSession,
  value: unknown,
) => TSession;

/**
 * Single step definition inside conversation flow
 */
export type StepDefinition<TSession, TStepId extends string> = {
  id: TStepId;
  question: string;
  apply: StepHandler<TSession>;
};

/**
 * Declarative conversation flow
 */
export type ConversationFlow<TSession, TStepId extends string> = {
  steps: StepDefinition<TSession, TStepId>[];
};
