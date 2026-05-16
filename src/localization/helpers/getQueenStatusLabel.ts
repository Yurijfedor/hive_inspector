import {TFunction} from 'i18next';

type QueenStatus = 'present' | 'absent' | 'unknown' | undefined;

export const getQueenStatusLabel = (status: QueenStatus, t: TFunction) => {
  switch (status) {
    case 'present':
      return t('queen:statuses.present');

    case 'absent':
      return t('queen:statuses.absent');

    default:
      return t('queen:statuses.unknown');
  }
};
