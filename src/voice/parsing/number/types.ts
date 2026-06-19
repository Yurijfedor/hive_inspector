export interface NumberLexicon {
  cardinal: Record<string, number>;
}

export interface NumberEngineOptions {
  lexicon: NumberLexicon;
}

export interface NumberParseResult {
  value: number | null;
}
