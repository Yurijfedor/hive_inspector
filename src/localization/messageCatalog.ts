export const messageCatalog = {
  'inspection.askHive': 'Скажіть номер вулика.',
  'inspection.retryHive': 'Я не зрозумів номер. Скажіть номер ще раз.',
} as const;

export type MessageId = keyof typeof messageCatalog;
