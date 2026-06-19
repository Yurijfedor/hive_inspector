export interface NumberLexicon {
  cardinal: Record<string, number>;
}

export interface NumberEngineOptions {
  lexicon: NumberLexicon;
}

export interface NumberParseResult {
  success: boolean;

  value: number | null;
}
