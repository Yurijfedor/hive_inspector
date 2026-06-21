import {tokenize} from '../../../utils/voiceParser/voiceParser';

import {ExactMatchStrategy} from './strategies/ExactMatchStrategy';

import {NumberEngineOptions, NumberParseResult} from './types';

export class NumberEngine {
  private readonly strategy = new ExactMatchStrategy();

  constructor(private readonly options: NumberEngineOptions) {}

  parse(input: string): NumberParseResult {
    const tokens = tokenize(input);
    const matches = this.strategy.parse(tokens, this.options.lexicon.cardinal);

    return {
      value: matches.length ? matches[0].value : null,
    };
  }
}
