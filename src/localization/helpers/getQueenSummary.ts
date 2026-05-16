import {TFunction} from 'i18next';

import {getQueenStatusLabel} from './getQueenStatusLabel';

type QueenData = {
  status?: 'present' | 'absent' | 'unknown';

  breed?: string;

  birthYear?: string | number;
};

export const getQueenSummary = (queen: QueenData | undefined, t: TFunction) => {
  if (!queen) {
    return getQueenStatusLabel(undefined, t);
  }

  const statusLabel = getQueenStatusLabel(queen.status, t);

  if (queen.status !== 'present') {
    return statusLabel;
  }

  return `${statusLabel} (${queen.breed ?? '—'}, ${queen.birthYear ?? '—'})`;
};
