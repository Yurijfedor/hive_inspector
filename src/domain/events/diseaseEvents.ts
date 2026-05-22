import {BaseEvent} from './baseEvent';

import type {DiseaseType} from '../../types/disease';

export type DiseaseEvent =
  | ({
      type: 'UPDATE_DISEASE';

      payload: {
        disease?: DiseaseType;

        diarrhea?: boolean;

        deformedWings?: boolean;

        mitesVisible?: boolean;

        weakBrood?: boolean;
      };
    } & BaseEvent)
  | ({
      type: 'STOP_DISEASE';
    } & BaseEvent);
