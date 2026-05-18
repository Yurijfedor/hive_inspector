import {TFunction} from 'i18next';

import {ApiaryCategory} from '../../domain/apiary';

export const getApiaryCategoryLabel = (
  category: ApiaryCategory,
  t: TFunction,
) => {
  return t(`apiary:categories.${category}`);
};
