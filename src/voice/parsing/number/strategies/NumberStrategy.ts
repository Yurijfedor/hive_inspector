export interface NumberStrategy {
  parse(tokens: string[], lexicon: Record<string, number>): number | null;
}
