import { NumberStrategy } from './NumberStrategy';
import { NumberToken } from '../types';

export class ExactMatchStrategy implements NumberStrategy {
    parse(tokens: string[], lexicon: Record<string, number>): NumberToken[] {
        const result: NumberToken[] = [];

        for (const token of tokens) {
            const value = lexicon[token];

            if (value !== undefined) {
                result.push({
                    token,
                    value,
                });
            }
        }

        return result;
    }
}