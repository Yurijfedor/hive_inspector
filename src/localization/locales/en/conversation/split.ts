import type {ConversationModule} from '../../../conversation/types';

type SplitBroodConfirmParams = {
  broodFrames: number;
};

type SplitFoodConfirmParams = {
  foodFrames: number;
};

export const split: ConversationModule = {
  'split.askBroodFrames': (_params) => 'How many brood frames should be taken?',

  'split.retryBroodFrames': (_params) =>
    'Please say a number between 0 and 20.',

  'split.confirmBroodFrames': (params) => {
    const {broodFrames} = params as SplitBroodConfirmParams;

    return `${broodFrames} brood frames. Is that correct?`;
  },

  'split.askFoodFrames': (_params) => 'How many food frames should be taken?',

  'split.retryFoodFrames': (_params) => 'Please say a number between 0 and 20.',

  'split.confirmFoodFrames': (params) => {
    const {foodFrames} = params as SplitFoodConfirmParams;

    return `${foodFrames} food frames. Is that correct?`;
  },

  'split.askIsSplit': (_params) => 'Is this colony a nucleus colony?',

  'split.askUseForSplits': (_params) =>
    'Would you like to use this colony to create nucleus colonies?',
};
