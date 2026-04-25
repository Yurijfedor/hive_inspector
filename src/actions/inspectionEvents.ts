import {BaseEvent} from '../domain/events/baseEvent';

export type InspectionEvent =
  | ({
      type: 'STOP_INSPECTION';
    } & BaseEvent)
  | ({
      type: 'UPDATE_INSPECTION';

      payload: {
        strength?: number | null;
        honeyKg?: number | null;
        broodFrames?: number | null;
        queen?: 'present' | 'absent' | 'unknown' | null;
        syrupLiters?: number | null;
      };
    } & BaseEvent);
