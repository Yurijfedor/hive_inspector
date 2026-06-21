export interface NumberLexicon {
  cardinal: Record<string, number>;
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
}
