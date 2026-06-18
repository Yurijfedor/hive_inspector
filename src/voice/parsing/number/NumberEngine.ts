import {NumberParseContext, NumberParseResult} from './types';

export class NumberEngine {
  parse(tokens: string[], context: NumberParseContext): NumberParseResult {
    if (tokens.length === 0) {
      return {
        success: false,
        value: null,
      };
    }

    const token = tokens[0];

    const value = context.lexicon.cardinal[token];

    if (value === undefined) {
      return {
        success: false,
        value: null,
      };
    }

    return {
      success: true,
      value,
    };
  }
}
