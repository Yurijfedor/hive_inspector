import {FlowEffect} from '../../conversation/types';
/**
 * Function that applies user answer to session
 */
export type StepHandler<TSession> = (
  session: TSession,
  value: unknown,
) => TSession;

/**
 * Side effects emitted after successful step accept
 */
export type StepEffect<TSession> = (session: TSession) => FlowEffect[];

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

  /** emitted only when step is ACCEPTED */
  afterAccept?: StepEffect<TSession>;
};

export type StepResult<TSession> =
  | {
      type: 'ACCEPT';
      session: TSession;
      effects: FlowEffect[];
    }
  | {
      type: 'RETRY';
      message: string;
    };

/**
 * Declarative conversation flow
 */
export type ConversationFlow<TSession> = {
  id: string;
  createSession: (...args: any[]) => TSession;
  steps: StepDefinition<TSession>[];
};
