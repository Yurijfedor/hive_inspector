import type {ConversationModule} from '../../../conversation/types';

type FeedingConfirmParams = {
  hiveNumber: number | string;
  syrupLiters: number;
};

export const feeding: ConversationModule = {
  'feeding.askSyrupAmount': (_params) =>
    'How many liters of syrup should be added?',

  'feeding.retrySyrupAmount': (_params) => 'Please say the number of liters.',

  'feeding.confirm': (params) => {
    const {hiveNumber, syrupLiters} = params as FeedingConfirmParams;

    return `Add ${syrupLiters} liters of syrup to hive number ${hiveNumber}?`;
  },
};
