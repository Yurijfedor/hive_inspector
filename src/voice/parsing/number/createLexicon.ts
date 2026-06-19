import {normalizeText} from '../../../utils/voiceParser/voiceParser';
import {NumberLexicon} from './types';

export function createLexicon(cardinal: Record<string, number>): NumberLexicon {
  const normalized: Record<string, number> = {};

  for (const [key, value] of Object.entries(cardinal)) {
    normalized[normalizeText(key)] = value;
  }

  return {
    cardinal: normalized,
  };
}
