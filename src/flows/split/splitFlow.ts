export const splitStepIds = {
  IS_SPLIT: true,
  USE_FOR_SPLITS: true,
  BROOD_FRAMES: true,
  FOOD_FRAMES: true,
} as const;

export type SplitStepId = keyof typeof splitStepIds;
