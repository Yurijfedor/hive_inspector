import {NumberToken, NumberTokenDefinition} from '../types';

export interface NumberStrategy {
  parse(
    tokens: string[],
    lexicon: Record<string, NumberTokenDefinition>,
  ): NumberToken[];
}
