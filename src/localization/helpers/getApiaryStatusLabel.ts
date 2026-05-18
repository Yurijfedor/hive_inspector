import {TFunction} from 'i18next';

export const getApiaryStatusLabel = (
  status: 'good' | 'warning' | 'critical',
  t: TFunction,
) => {
  return t(`apiaryDashboard:status.${status}`);
};
