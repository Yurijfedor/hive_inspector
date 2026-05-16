import {TFunction} from 'i18next';

import {getBooleanSignLabel} from './getBooleanSignLabel';

type SwarmData = {
  hasSwarmSigns?: boolean | 'так' | 'ні';
};

export const getSwarmSummary = (swarm: SwarmData | undefined, t: TFunction) => {
  const hasSigns =
    swarm?.hasSwarmSigns === true || swarm?.hasSwarmSigns === 'так';

  return getBooleanSignLabel(hasSigns, t);
};
