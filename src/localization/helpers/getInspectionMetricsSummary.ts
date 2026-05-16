import {TFunction} from 'i18next';

type InspectionMetrics = {
  strength?: number | string;

  broodFrames?: number | string;

  honeyKg?: number | string;
};

export const getInspectionMetricsSummary = (
  inspection: InspectionMetrics | undefined,
  t: TFunction,
) => {
  if (!inspection) {
    return [];
  }

  return [
    {
      label: t('hive:fields.strength'),
      value: inspection.strength ?? '—',
    },

    {
      label: t('hive:fields.brood'),
      value: inspection.broodFrames ?? '—',
    },

    {
      label: t('hive:fields.honey'),
      value: `${inspection.honeyKg ?? '—'} kg`,
    },
  ];
};
