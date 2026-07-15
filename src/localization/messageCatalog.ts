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
  'feeding.askSyrupAmount': (_params) => 'Скільки літрів сиропу додати?',

  'feeding.retrySyrupAmount': (_params) => 'Назвіть кількість літрів числом.',
  'feeding.confirm': (params) =>
    `Додати ${params.syrupLiters} літрів сиропу у вулик ${params.hiveNumber}?`,
  'split.askBroodFrames': (_params) =>
    'Скільки рамок розплоду потрібно відібрати?',

  'split.retryBroodFrames': (_params) => 'Назвіть число від 0 до 20.',

  'split.confirmBroodFrames': (params) =>
    `${params.broodFrames} рамки розплоду. Правильно?`,
  'split.askFoodFrames': (_params) =>
    'Скільки кормових рамок потрібно відібрати?',

  'split.retryFoodFrames': (_params) => 'Назвіть число від 0 до 20.',

  'split.confirmFoodFrames': (params) =>
    `${params.foodFrames} кормові рамки. Правильно?`,
  'disease.askDeformedWings': (_params) =>
    'Чи є бджоли з деформованими крилами?',

  'disease.askMitesVisible': (_params) =>
    'Чи видно кліщів на бджолах або в піддоні?',

  'disease.askWeakBrood': (_params) => 'Чи є дірявий або слабкий розплід?',
  'swarm.askQueenEmergence': (_params) => 'Чи є виходи маток з маточників?',

  'swarm.askSealedCells': (_params) => 'Чи є печатні маточники?',

  'swarm.askOpenCells': (_params) => 'Чи є відкриті маточники?',

  'swarm.askEggsInCells': (_params) => 'Чи є яйця в маточниках?',
  'inspection.askQueen': (_params) => 'Чи є матка?',
  'split.askIsSplit': (_params) => 'Чи є ця сімʼя відводком?',
  'split.askUseForSplits': (_params) =>
    'Чи хочете використати цю сімʼю для формування відводків?',
} as const;

export type MessageId = keyof typeof messageCatalog;
