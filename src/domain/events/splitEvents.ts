import {BaseEvent} from './baseEvent';

export type SplitEvent =
  | ({
      type: 'UPDATE_SPLIT';
      payload: {
        isSplit?: boolean;
        usedForSplits?: boolean;
        broodFrames?: number;
        foodFrames?: number;
      };
    } & BaseEvent)
  | ({
      type: 'STOP_SPLIT';
    } & BaseEvent);
