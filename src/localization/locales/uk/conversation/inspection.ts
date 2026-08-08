import type {ConversationModule} from '../../../conversation/types';

export const inspection: ConversationModule = {
  'inspection.askHive': (_params) =>
    'Назвіть номер вулика або скажіть «завершити огляд».',
  'inspection.retryHive': (_params) =>
    'Я не зрозумів номер. Скажіть номер ще раз.',
  'inspection.confirmStrength': (params) =>
    `${params.strength} рамок сили. Правильно?`,
  'inspection.askStrength': (_params) =>
    "Яка сила бджолосім'ї? Назвіть кількість рамок.",
  'inspection.retryStrength': (_params) => 'Назвіть число рамок від 1 до 20.',
  'inspection.askBrood': (_params) => 'Скільки рамок з розплодом?',
  'inspection.retryBrood': (_params) =>
    'Назвіть число рамок з розплодом від 1 до 20.',
  'inspection.confirmBrood': (params) =>
    `${params.broodFrames} рамок розплоду. Правильно?`,
  'inspection.askHoney': (_params) => 'Скільки приблизно кілограмів меду?',

  'inspection.retryHoney': (_params) =>
    'Назвіть приблизну кількість кілограмів меду числом.',

  'inspection.confirmHoney': (params) =>
    `${params.honeyKg} кілограм меду. Правильно?`,
  'inspection.askQueen': (_params) => 'Чи є матка?',
  'inspection.askQueenBreed': (_params) =>
    'Яка порода матки? Карніка, бакфаст чи місцева?',

  'inspection.retryQueenBreed': (_params) =>
    'Скажіть: карніка, бакфаст або місцева.',

  'inspection.askQueenYear': (_params) => 'Якого року матка?',

  'inspection.retryQueenYear': (_params) => 'Назвіть рік, наприклад 2024.',
};
