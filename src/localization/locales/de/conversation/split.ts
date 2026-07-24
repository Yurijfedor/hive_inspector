import type {ConversationModule} from '../../../conversation/types';

type SplitBroodConfirmParams = {
  broodFrames: number;
};

type SplitFoodConfirmParams = {
  foodFrames: number;
};

export const split: ConversationModule = {
  'split.askBroodFrames': (_params) =>
    'Скільки рамок розплоду потрібно відібрати?',

  'split.retryBroodFrames': (_params) => 'Назвіть число від 0 до 20.',

  'split.confirmBroodFrames': (params) => {
    const {broodFrames} = params as SplitBroodConfirmParams;

    return `${broodFrames} рамки розплоду. Правильно?`;
  },

  'split.askFoodFrames': (_params) =>
    'Скільки кормових рамок потрібно відібрати?',

  'split.retryFoodFrames': (_params) => 'Назвіть число від 0 до 20.',

  'split.confirmFoodFrames': (params) => {
    const {foodFrames} = params as SplitFoodConfirmParams;

    return `${foodFrames} кормові рамки. Правильно?`;
  },

  'split.askIsSplit': (_params) => 'Чи є ця сімʼя відводком?',

  'split.askUseForSplits': (_params) =>
    'Чи хочете використати цю сімʼю для формування відводків?',
};
