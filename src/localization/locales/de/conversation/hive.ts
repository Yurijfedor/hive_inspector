import type {ConversationModule} from '../../../conversation/types';

type HiveConfirmParams = {
  hiveNumber: number | string;
};

export const hive: ConversationModule = {
  'hive.confirm': (params) => {
    const {hiveNumber} = params as HiveConfirmParams;

    return `Stocknummer ${hiveNumber}? Bitte sagen Sie „Ja“ oder „Nein“.`;
  },
};
