import {QUEEN_BREEDS} from '../constants/queen';

import {normalizeText} from './textNormalizer';

export function normalizeQueenBreed(input: unknown) {
  const text = normalizeText(input);

  // LOCAL
  if (text.includes('місц') || text.includes('local')) {
    return QUEEN_BREEDS.LOCAL;
  }

  // CARNICA
  if (text.includes('карн') || text.includes('carnica')) {
    return QUEEN_BREEDS.CARNICA;
  }

  // BUCKFAST
  if (text.includes('бак') || text.includes('buckfast')) {
    return QUEEN_BREEDS.BUCKFAST;
  }

  return QUEEN_BREEDS.UNKNOWN;
}
