export const feedingStepIds = {
  SYRUP_AMOUNT: true,
  CONFIRM_AMOUNT: true,

  CONFIRM_FEEDING: true,
} as const;

export type FeedingStepId = keyof typeof feedingStepIds;
