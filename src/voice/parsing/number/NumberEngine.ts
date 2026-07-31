import {tokenize} from '../../../utils/voiceParser/voiceParser';

import {ExactMatchStrategy} from './strategies/ExactMatchStrategy';

import {NumberEngineOptions, NumberParseResult} from './types';
import {NumberRules} from './rules/NumberRules';

export class NumberEngine {
  private readonly strategy = new ExactMatchStrategy();

  private readonly rules = new NumberRules();

  constructor(private readonly options: NumberEngineOptions) {}

  parse(input: string): NumberParseResult {
    const processedInput = this.options.preprocess
      ? this.options.preprocess(input)
      : input;

    const tokens = tokenize(processedInput);

    const matches = this.strategy.parse(tokens, this.options.lexicon.cardinal);

    console.log('🔢 TOKENS:', tokens);
    console.log('🔢 MATCHES:', matches);

    return {
      value: this.rules.compose(matches),
    };
  }
}
