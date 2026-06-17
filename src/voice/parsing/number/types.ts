export interface NumberLexicon {
  cardinal: Record<string, number>;
}

export interface NumberParseContext {
  lexicon: NumberLexicon;
}

export interface NumberParseResult {
  success: boolean;

  value: number | null;
}
