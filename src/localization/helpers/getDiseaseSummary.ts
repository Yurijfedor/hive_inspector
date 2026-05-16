import {TFunction} from 'i18next';

import {getBooleanSignLabel} from './getBooleanSignLabel';

type DiseaseData = {
  hasDiseaseSigns?: boolean | 'так' | 'ні';
};

export const getDiseaseSummary = (
  disease: DiseaseData | undefined,
  t: TFunction,
) => {
  const hasSigns =
    disease?.hasDiseaseSigns === true || disease?.hasDiseaseSigns === 'так';

  return getBooleanSignLabel(hasSigns, t);
};
