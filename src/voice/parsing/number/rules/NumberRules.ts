import {NumberToken} from '../types';

export class NumberRules {
  compose(tokens: NumberToken[]): number | null {
    if (tokens.length === 0) {
      return null;
    }

    let result = 0;

    for (const token of tokens) {
      switch (token.type) {
        case 'UNIT':
        case 'TENS':
          result += token.value;
          break;

        case 'HUNDRED':
          if (result === 0) {
            result += token.value;
          } else {
            result *= token.value;
          }
          break;
      }
    }
    console.log('🔢 RESULT:', result);

    return result;
  }
}
