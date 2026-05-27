import {TFunction} from 'i18next';

import {QUEEN_BREED, QueenBreed} from './queen.types';

export function getQueenBreedLabel(
  breed: QueenBreed | undefined,
  t: TFunction,
): string {
  if (!breed) {
    return '—';
  }

  switch (breed) {
    case QUEEN_BREED.CARNICA:
      return t('queen:breeds.carnica');

    case QUEEN_BREED.BUCKFAST:
      return t('queen:breeds.buckfast');

    case QUEEN_BREED.CARPATHIAN:
      return t('queen:breeds.carpathian');

    default:
      return breed;
  }
}
