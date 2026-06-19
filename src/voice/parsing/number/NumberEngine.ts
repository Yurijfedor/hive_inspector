import {NumberEngineOptions, NumberParseResult} from './types';

export class NumberEngine {
  constructor(private readonly options: NumberEngineOptions) {}

  parse(input: string): NumberParseResult {
    return {
      success: false,
      value: null,
    };
  }
}
