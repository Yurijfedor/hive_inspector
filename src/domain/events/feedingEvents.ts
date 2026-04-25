import {BaseEvent} from './baseEvent';

export type FeedingEvent =
  | ({
      type: 'UPDATE_FEEDING';
      payload: {
        syrupLiters: number;
      };
    } & BaseEvent)
  | ({
      type: 'STOP_FEEDING';
    } & BaseEvent);
