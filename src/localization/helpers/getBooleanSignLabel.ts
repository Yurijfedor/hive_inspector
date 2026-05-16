import {TFunction} from 'i18next';

export const getBooleanSignLabel = (value: boolean, t: TFunction) => {
  return value ? `⚠️ ${t('common:yes')}` : `✅ ${t('common:no')}`;
};
