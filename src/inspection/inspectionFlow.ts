export type InspectionStep = 'STRENGTH' | 'QUEEN' | 'HONEY' | 'CONFIRM';

export const inspectionQuestions = {
  STRENGTH: "Яка сила бджолосім'ї? Назвіть кількість рамок.",
  QUEEN: 'Чи є матка?',
  HONEY: 'Скільки приблизно кілограмів меду?',
  CONFIRM: 'Завершити огляд?',
};
