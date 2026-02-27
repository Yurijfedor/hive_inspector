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
export type StepDefinition<TSession> = {
  id: string;
  question: string;

  normalize?: (value: unknown) => unknown;

  validate?: (value: unknown) => boolean;

  retryMessage?: string;

  apply: (session: TSession, value: unknown) => TSession;
};

export type StepResult<TSession> =
  | {
      type: 'ACCEPT';
      session: TSession;
    }
  | {
      type: 'RETRY';
      message: string;
    };

/**
 * Declarative conversation flow
 */
export type ConversationFlow<TSession> = {
  steps: StepDefinition<TSession>[];
};
