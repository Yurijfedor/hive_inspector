import {NumberToken} from '../types';

export class NumberRules {
  compose(tokens: NumberToken[]): number | null {
    if (tokens.length === 0) {
      return null;
    }

    if (tokens.length === 1) {
      return tokens[0].value;
    }

    const first = tokens[0].value;
    const second = tokens[1].value;

    if (first >= 20 && first % 10 === 0 && second < 10) {
      return first + second;
    }

    return first;
  }
}
