import {tokenize} from '../../../utils/voiceParser/voiceParser';
import {NumberEngineOptions, NumberParseResult} from './types';

export class NumberEngine {
  constructor(private readonly options: NumberEngineOptions) {}

  parse(input: string): NumberParseResult {
    const tokens = tokenize(input);

    if (tokens.length === 0) {
      return {
        value: null,
      };
    }

    const value = this.options.lexicon.cardinal[tokens[0]];

    return {
      value: value ?? null,
    };
  }
}
