import {StepDefinition} from './conversationFlow';
import {MessageDefinition} from './conversationFlow';

export function createConfirmStep<TSession>(
  id: string,
  // question: (session: TSession) => string,
  prompt: MessageDefinition<TSession>,
  onConfirm?: (session: TSession) => any[],
): StepDefinition<TSession> {
  return {
    id,

    // question,
    messages: {
      prompt,
      retry: {
        id: 'common.retryYesNo',
      },
    },

    normalize: (v) => String(v).toLowerCase().trim(),

    validate: (v) => ['так', 'ні'].includes(v as string),

    // retryMessage: 'Скажіть "так" або "ні".',

    apply: (session: any, value: any) => {
      if (value === 'так') {
        return session;
      }

      return {
        ...session,
        stepIndex: session.stepIndex - 2,
      };
    },

    afterAccept: (session: any, value: any) => {
      if (value !== 'так') return [];

      return onConfirm ? onConfirm(session) : [];
    },
  };
}
