import {QUEEN_BREEDS} from '../domain/constants/queen';
import type {QueenBreed} from '../types/queen';

import {parseNumber} from './numberParser';
import {normalizeText, similarity} from '../utils/voiceParser/voiceParser';

function includesFuzzy(
  tokens: string[],
  target: string,
  threshold = 0.65,
): boolean {
  return tokens.some((t) => similarity(t, target) >= threshold);
}

/**
 * Voice selection:
 *
 * 1 → Buckfast
 * 2 → Carnica
 * 3 → Local
 */
const QUEEN_BREED_BY_NUMBER: Record<number, QueenBreed> = {
  1: QUEEN_BREEDS.BUCKFAST,
  2: QUEEN_BREEDS.CARNICA,
  3: QUEEN_BREEDS.LOCAL,
};

export function parseQueenBreed(input: unknown): QueenBreed | null {
  if (!input) {
    return null;
  }

  const raw = String(input);
  const text = normalizeText(raw);

  // --------------------------------------------------
  // PRIMARY: NUMBER SELECTION
  // --------------------------------------------------

  const number = parseNumber(text);

  if (number !== null) {
    return QUEEN_BREED_BY_NUMBER[number] ?? null;
  }

  // --------------------------------------------------
  // FALLBACK: OLD VOICE BREED RECOGNITION
  // --------------------------------------------------

  const tokens = text.split(' ');

  // LOCAL
  if (
    tokens.some((t) => t.startsWith('місц')) ||
    includesFuzzy(tokens, 'місцева') ||
    includesFuzzy(tokens, 'local')
  ) {
    return QUEEN_BREEDS.LOCAL;
  }

  // CARNICA
  if (
    tokens.some((t) => t.startsWith('карн')) ||
    includesFuzzy(tokens, 'карніка') ||
    includesFuzzy(tokens, 'карника') ||
    includesFuzzy(tokens, 'carnica')
  ) {
    return QUEEN_BREEDS.CARNICA;
  }

  // BUCKFAST
  if (
    tokens.some((t) => t.startsWith('бак')) ||
    includesFuzzy(tokens, 'бакфаст') ||
    includesFuzzy(tokens, 'бакфас') ||
    includesFuzzy(tokens, 'buckfast') ||
    includesFuzzy(tokens, 'фаст') ||
    includesFuzzy(tokens, 'фауст')
  ) {
    return QUEEN_BREEDS.BUCKFAST;
  }

  return null;
}
