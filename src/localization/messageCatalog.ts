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
  'disease.askDiarrhea': (_params) =>
    'Чи є сліди поносу на рамках або стінках?',
  'inspection.askStrength': (_params) =>
    "Яка сила бджолосім'ї? Назвіть кількість рамок.",
  'inspection.retryStrength': (_params) => 'Назвіть число рамок від 1 до 20.',
  'inspection.askBrood': (_params) => 'Скільки рамок з розплодом?',
  'inspection.retryBrood': (_params) => 'Назвіть число рамок з розплодом.',
  'inspection.confirmBrood': (params) =>
    `${params.broodFrames} рамок розплоду. Правильно?`,
  'inspection.askHoney': (_params) => 'Скільки приблизно кілограмів меду?',

  'inspection.retryHoney': (_params) =>
    'Назвіть приблизну кількість кілограмів меду числом.',

  'inspection.confirmHoney': (params) =>
    `${params.honeyKg} кілограм меду. Правильно?`,
} as const;

export type MessageId = keyof typeof messageCatalog;
