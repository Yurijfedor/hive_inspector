export type MessageResolver = (params: Record<string, unknown>) => string;

export const messageCatalog: Record<string, MessageResolver> = {
  'inspection.askHive': (_params) => 'Скажіть номер вулика.',
  'inspection.retryHive': (_params) =>
    'Я не зрозумів номер. Скажіть номер ще раз.',
  'hive.confirm': (params) =>
    `Вулик ${params.hiveNumber}? Скажіть "так" або "ні".`,
  'common.retryYesNo': (_params) => 'Скажіть "так" або "ні".',
  'inspection.confirmStrength': (params) =>
    `${params.strength} рамок сили. Правильно?`,
} as const;

export type MessageId = keyof typeof messageCatalog;
