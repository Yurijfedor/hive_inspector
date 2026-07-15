import {StepDefinition} from './conversationFlow';
import {MessageDefinition} from './conversationFlow';
import {normalizeBoolean} from '../domain/normalizers/booleanNormalizer';

export function createBooleanStep<TSession>(
  id: string,
  prompt: MessageDefinition<TSession>,
  apply: StepDefinition<TSession>['apply'],
): StepDefinition<TSession> {
  return {
    id,

    messages: {
      prompt,
      retry: {
        id: 'common.retryYesNo',
      },
    },

    normalize: (v) => normalizeBoolean(v),

    validate: (v) => v !== null,

    apply,
  };
}
