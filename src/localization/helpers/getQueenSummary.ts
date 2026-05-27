import {TFunction} from 'i18next';

import {getQueenStatusLabel} from './getQueenStatusLabel';

import type {QueenBreed} from '../../types/queen';

type QueenData = {
  status?: 'present' | 'absent' | 'unknown';

  breed?: QueenBreed;

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

  const breedLabel = queen.breed ? t(`queen:breeds.${queen.breed}`) : '—';

  return `${statusLabel} (${breedLabel}, ${queen.birthYear ?? '—'})`;
};
