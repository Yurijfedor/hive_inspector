import {NumberToken} from '../types';

export interface NumberStrategy {
  parse(tokens: string[], lexicon: Record<string, number>): NumberToken[];
}
