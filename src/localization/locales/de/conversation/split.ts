import type {ConversationModule} from '../../../conversation/types';

type SplitBroodConfirmParams = {
  broodFrames: number;
};

type SplitFoodConfirmParams = {
  foodFrames: number;
};

export const split: ConversationModule = {
  'split.askBroodFrames': (_params) =>
    'Wie viele Brutwaben sollen entnommen werden?',

  'split.retryBroodFrames': (_params) =>
    'Bitte nennen Sie eine Zahl zwischen 0 und 20.',

  'split.confirmBroodFrames': (params) => {
    const {broodFrames} = params as SplitBroodConfirmParams;

    return `${broodFrames} Brutwaben. Ist das richtig?`;
  },

  'split.askFoodFrames': (_params) =>
    'Wie viele Futterwaben sollen entnommen werden?',

  'split.retryFoodFrames': (_params) =>
    'Bitte nennen Sie eine Zahl zwischen 0 und 20.',

  'split.confirmFoodFrames': (params) => {
    const {foodFrames} = params as SplitFoodConfirmParams;

    return `${foodFrames} Futterwaben. Ist das richtig?`;
  },

  'split.askIsSplit': (_params) => 'Ist dieses Volk ein Ableger?',

  'split.askUseForSplits': (_params) =>
    'Möchten Sie dieses Volk zur Bildung von Ablegern verwenden?',
};
