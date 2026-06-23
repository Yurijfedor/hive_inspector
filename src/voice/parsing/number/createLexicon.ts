import {normalizeText} from '../../../utils/voiceParser/voiceParser';

import {NumberLexicon, NumberTokenDefinition} from './types';

export function createLexicon(
  cardinal: Record<string, NumberTokenDefinition>,
): NumberLexicon {
  const normalized: Record<string, NumberTokenDefinition> = {};

  for (const [key, value] of Object.entries(cardinal)) {
    normalized[normalizeText(key)] = value;
  }

  return {
    cardinal: normalized,
  };
}
