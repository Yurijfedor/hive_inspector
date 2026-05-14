import {TFunction} from 'i18next';

const DAY_MS = 1000 * 60 * 60 * 24;

export function getRelativeDateLabel(timestamp: number, t: TFunction) {
  const now = new Date();

  const target = new Date(timestamp);

  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffDays = Math.floor(
    (targetStart.getTime() - nowStart.getTime()) / DAY_MS,
  );

  if (diffDays === 0) {
    return t('relativeDates:today');
  }

  if (diffDays === 1) {
    return t('relativeDates:tomorrow');
  }

  if (diffDays === -1) {
    return t('relativeDates:yesterday');
  }

  if (diffDays > 1) {
    return t('relativeDates:inDays', {
      count: diffDays,
    });
  }

  return t('relativeDates:daysAgo', {
    count: Math.abs(diffDays),
  });
}
