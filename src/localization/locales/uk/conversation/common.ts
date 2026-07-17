import {MessageResolver} from '../../../messageCatalog';

export const common: Record<string, MessageResolver> = {
  'common.retryYesNo': (_params) => 'Скажіть "так" або "ні".',
};
