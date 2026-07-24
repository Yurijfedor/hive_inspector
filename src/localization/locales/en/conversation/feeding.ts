import type {ConversationModule} from '../../../conversation/types';

type FeedingConfirmParams = {
  hiveNumber: number | string;
  syrupLiters: number;
};

export const feeding: ConversationModule = {
  'feeding.askSyrupAmount': (_params) => 'Скільки літрів сиропу додати?',

  'feeding.retrySyrupAmount': (_params) => 'Назвіть кількість літрів числом.',

  'feeding.confirm': (params) => {
    const {hiveNumber, syrupLiters} = params as FeedingConfirmParams;

    return `Додати ${syrupLiters} літрів сиропу у вулик ${hiveNumber}?`;
  },
};
