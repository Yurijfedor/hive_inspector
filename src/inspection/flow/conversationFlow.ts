import {FlowEffect, RuntimeEffect} from '../../conversation/types';

export type StepHandler<TSession> = (
  session: TSession,
  value: unknown,
) => TSession;

export type StepEffect<TSession> = (session: TSession) => FlowEffect[];

export type StepRuntimeEffect<TSession> = (
  session: TSession,
  value: unknown,
) => RuntimeEffect[];

export type StepDefinition<TSession> = {
  id: string;
  question?: string | ((session: TSession) => string);

  normalize?: (value: unknown) => unknown;

  validate?: (value: unknown) => boolean;

  retryMessage?: string;

  apply: (session: TSession, value: unknown) => TSession;

  /** domain effects */
  afterAccept?: StepEffect<TSession>;

  /** runtime effects */
  runtimeEffects?: StepRuntimeEffect<TSession>;
};

export type StepResult<TSession> =
  | {
      type: 'ACCEPT';
      session: TSession;
      effects: FlowEffect[];
      runtimeEffects?: RuntimeEffect[];
    }
  | {
      type: 'RETRY';
      message: string;
    };

export type ConversationFlow<TSession> = {
  id: string;
  createSession: (...args: any[]) => TSession;
  steps: StepDefinition<TSession>[];
};
