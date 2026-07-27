import type {ConversationModule} from '../../../conversation/types';

type FeedingConfirmParams = {
  hiveNumber: number | string;
  syrupLiters: number;
};

export const feeding: ConversationModule = {
  'feeding.askSyrupAmount': (_params) =>
    'Wie viele Liter Sirup sollen hinzugefügt werden?',

  'feeding.retrySyrupAmount': (_params) =>
    'Bitte nennen Sie die Anzahl der Liter.',

  'feeding.confirm': (params) => {
    const {hiveNumber, syrupLiters} = params as FeedingConfirmParams;

    return `Sollen ${syrupLiters} Liter Sirup dem Stock Nummer ${hiveNumber} hinzugefügt werden?`;
  },
};
