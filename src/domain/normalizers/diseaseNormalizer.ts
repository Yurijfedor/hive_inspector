import {DISEASE_TYPES} from '../constants/disease';

import {normalizeText} from './textNormalizer';

export function normalizeDiseaseType(input: unknown) {
  const text = normalizeText(input);

  switch (text) {
    case 'nosema':
      return DISEASE_TYPES.NOSEMA;

    case 'varroa':
      return DISEASE_TYPES.VARROA;

    case 'varroa_or_dwv':
      return DISEASE_TYPES.VARROA_OR_DWV;

    case 'brood_disease':
      return DISEASE_TYPES.BROOD_DISEASE;

    default:
      return DISEASE_TYPES.NONE;
  }
}
