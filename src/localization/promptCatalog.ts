export const promptCatalog = {
  'inspection.askHive': 'Скажіть номер вулика.',
} as const;

export type PromptId = keyof typeof promptCatalog;
