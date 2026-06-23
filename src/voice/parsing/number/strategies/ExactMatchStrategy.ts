import {NumberStrategy} from './NumberStrategy';

import {NumberToken, NumberTokenDefinition} from '../types';

export class ExactMatchStrategy implements NumberStrategy {
  parse(
    tokens: string[],
    lexicon: Record<string, NumberTokenDefinition>,
  ): NumberToken[] {
    const result: NumberToken[] = [];

    for (const token of tokens) {
      const definition = lexicon[token];

      if (!definition) {
        continue;
      }

      result.push({
        token,
        value: definition.value,
        type: definition.type,
      });
    }

    return result;
  }
}
