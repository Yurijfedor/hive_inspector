import {StepDefinition, MessageDefinition} from './conversationFlow';
import {parseNumber} from '../voice/numberParser';

type NumberStepOptions<TSession> = {
  min: number;
  max: number;
  retry: MessageDefinition<TSession>;
};

export function createNumberStep<TSession>(
  id: string,
  prompt: MessageDefinition<TSession>,
  options: NumberStepOptions<TSession>,
  apply: StepDefinition<TSession>['apply'],
): StepDefinition<TSession> {
  return {
    id,

    messages: {
      prompt,
      retry: options.retry,
    },

    normalize: (v) => parseNumber(String(v)),

    validate: (value) =>
      typeof value === 'number' &&
      !isNaN(value) &&
      value >= options.min &&
      value <= options.max,

    apply,
  };
}
