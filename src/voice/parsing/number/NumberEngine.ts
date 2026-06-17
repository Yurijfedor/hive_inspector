import {NumberParseContext, NumberParseResult} from './types';

export class NumberEngine {
  parse(tokens: string[], context: NumberParseContext): NumberParseResult {
    return {
      success: false,
      value: null,
    };
  }
}
