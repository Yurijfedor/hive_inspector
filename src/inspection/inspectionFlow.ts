export const inspectionStepIds = {
  STRENGTH: true,
  CONFIRM_STRENGTH: true,

  QUEEN: true,
  CONFIRM_QUEEN: true,

  HONEY: true,
  CONFIRM_HONEY: true,

  CONFIRM: true,
} as const;

export type InspectionStepId = keyof typeof inspectionStepIds;
