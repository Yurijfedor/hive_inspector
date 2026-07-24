import type {ConversationModule} from '../../../conversation/types';

type HiveConfirmParams = {
  hiveNumber: number | string;
};

export const hive: ConversationModule = {
  'hive.confirm': (params) => {
    const {hiveNumber} = params as HiveConfirmParams;

    return `Вулик ${hiveNumber}? Скажіть "так" або "ні".`;
  },
};
