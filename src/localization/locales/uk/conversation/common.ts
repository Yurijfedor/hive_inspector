import type {MessageResolver} from '../../../conversation/types';

export const common: Record<string, MessageResolver> = {
  'common.retryYesNo': (_params) => 'Скажіть "так" або "ні".',
};
