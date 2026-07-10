export const messageCatalog = {
  'inspection.askHive': 'Скажіть номер вулика.',
} as const;

export type MessageId = keyof typeof messageCatalog;
