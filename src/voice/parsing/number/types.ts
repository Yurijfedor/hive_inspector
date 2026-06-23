export interface NumberLexicon {
  cardinal: Record<string, NumberTokenDefinition>;
}

export interface NumberEngineOptions {
  lexicon: NumberLexicon;
}

export interface NumberParseResult {
  value: number | null;
}

export interface NumberToken {
  token: string;

  value: number;

  type: NumberTokenType;
}

export type NumberTokenType = 'UNIT' | 'TENS' | 'MULTIPLIER';

export interface NumberTokenDefinition {
  value: number;

  type: NumberTokenType;
}
