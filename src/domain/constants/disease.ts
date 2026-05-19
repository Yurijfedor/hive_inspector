export const DISEASE_TYPES = {
  NONE: 'none',
  NOSEMA: 'nosema',
  VARROA: 'varroa',
  VARROA_OR_DWV: 'varroa_or_dwv',
  BROOD_DISEASE: 'brood_disease',
} as const;

export type DiseaseType = (typeof DISEASE_TYPES)[keyof typeof DISEASE_TYPES];
