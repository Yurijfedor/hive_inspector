import {BaseEvent} from './baseEvent';

export type SwarmEvent =
  | ({
      type: 'UPDATE_SWARM';
      payload: {
        queenEmergence?: boolean;
        sealedCells?: boolean;
        openCells?: boolean;
        eggsInCells?: boolean;
      };
    } & BaseEvent)
  | ({
      type: 'STOP_SWARM';
    } & BaseEvent);
