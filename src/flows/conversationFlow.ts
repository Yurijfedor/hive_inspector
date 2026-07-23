import {FlowEffect, RuntimeEffect} from '../conversation/types';
import type {ConversationMessageId} from '../localization/locales/uk/conversation';

export type StepMessages<TSession> = {
  prompt?: MessageDefinition<TSession>;
  retry?: MessageDefinition<TSession>;
};

export type MessageDefinition<TSession> = {
  id: ConversationMessageId;

  params?: (session: TSession) => Record<string, unknown>;
};

export type StepHandler<TSession> = (
  session: TSession,
  value: unknown,
) => TSession;

export type StepEffectResult = {
  effects?: FlowEffect[];
  runtimeEffects?: RuntimeEffect[];
};

export type StepEffect<TSession> = (
  session: TSession,
  value: unknown,
) => FlowEffect[] | StepEffectResult;

export type StepRuntimeEffect<TSession> = (
  session: TSession,
  value: unknown,
) => RuntimeEffect[];

export type StepDefinition<TSession> = {
  id: string;

  question?: string | ((session: TSession) => string);

  prompt?: MessageDefinition<TSession>;

  messages?: StepMessages<TSession>;

  // grammar?: string[];

  normalize?: (value: unknown) => unknown;

  validate?: (value: unknown) => boolean;

  retryMessage?: string;

  shouldSkip?: (session: TSession, context: any) => boolean;

  apply: (
    session: TSession,
    value: unknown,
  ) => TSession | StepApplyResult<TSession>;

  afterAccept?: StepEffect<TSession>;

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
      // message: string;
    };

export type ConversationFlow<TSession> = {
  id: string;
  createSession: (...args: any[]) => TSession;
  steps: StepDefinition<TSession>[];
};

export type StepApplyResult<TSession> = {
  session: TSession;
  effects?: FlowEffect[];
  runtimeEffects?: RuntimeEffect[];
};
