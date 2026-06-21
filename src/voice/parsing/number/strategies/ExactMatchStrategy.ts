import {NumberStrategy} from './NumberStrategy';

export class ExactMatchStrategy implements NumberStrategy {
  parse(tokens: string[], lexicon: Record<string, number>): number | null {
    for (const token of tokens) {
      const value = lexicon[token];

      if (value !== undefined) {
        return value;
      }
    }

    return null;
  }
}
