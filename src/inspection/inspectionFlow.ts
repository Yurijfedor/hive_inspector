// export type InspectionStep = 'STRENGTH' | 'QUEEN' | 'HONEY' | 'CONFIRM';

export const inspectionStepIds = {
  STRENGTH: true,
  QUEEN: true,
  HONEY: true,
  CONFIRM: true,
} as const;

export type InspectionStepId = keyof typeof inspectionStepIds;
