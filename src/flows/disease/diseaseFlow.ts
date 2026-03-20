export const diseaseStepIds = {
  DISEASE_SIGNS: true,
  CONFIRM_DISEASE_SIGNS: true,

  DISEASE_DETAILS: true,
  CONFIRM_DISEASE_DETAILS: true,

  CONFIRM: true,
} as const;

export type DiseaseStepId = keyof typeof diseaseStepIds;
