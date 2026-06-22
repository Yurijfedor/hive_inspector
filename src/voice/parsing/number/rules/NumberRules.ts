import {NumberToken} from '../types';

export class NumberRules {
  compose(tokens: NumberToken[]): number | null {
    if (tokens.length === 0) {
      return null;
    }

    return tokens[0].value;
  }
}
