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

    for (const token of tokens) {
      const value = this.options.lexicon.cardinal[token];

      if (value !== undefined) {
        return {
          value,
        };
      }
    }

    return {
      value: null,
    };
  }
}
