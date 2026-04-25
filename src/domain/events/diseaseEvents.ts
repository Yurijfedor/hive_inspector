import {BaseEvent} from './baseEvent';

export type DiseaseEvent =
  | ({
      type: 'UPDATE_DISEASE';
      payload: {
        disease?:
          | 'NOSEMA'
          | 'VARROA'
          | 'VARROA_OR_DWV'
          | 'BROOD_DISEASE'
          | 'NONE'; // 👈 ДОДАТИ
        diarrhea?: boolean;
        deformedWings?: boolean;
        mitesVisible?: boolean;
        weakBrood?: boolean;
      };
    } & BaseEvent)
  | ({
      type: 'STOP_DISEASE';
    } & BaseEvent);
