import {StepDefinition} from './conversationFlow';
import {MessageDefinition} from './conversationFlow';
import {normalizeBoolean} from '../domain/normalizers/booleanNormalizer';

export function createConfirmStep<TSession>(
  id: string,
  prompt: MessageDefinition<TSession>,
  onConfirm?: (session: TSession) => any[],
  shouldSkip?: (session: TSession) => boolean,
): StepDefinition<TSession> {
  return {
    id,

    messages: {
      prompt,
      retry: {
        id: 'common.retryYesNo',
      },
    },

    shouldSkip,

    normalize: normalizeBoolean,

    validate: (v) => v !== null,

    apply: (session: any, value: any) => {
      if (value === true) {
        return session;
      }

      return {
        ...session,
        stepIndex: session.stepIndex - 2,
      };
    },

    afterAccept: (session: any, value: any) => {
      if (value !== true) return [];

      return onConfirm ? onConfirm(session) : [];
    },
  };
}
