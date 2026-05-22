import type {QueenStatus, QueenBreed} from '../../types/queen';

import {BaseEvent} from './baseEvent';

export type QueenPayload = Partial<{
  status: QueenStatus;

  breed: QueenBreed;

  birthYear: number;

  marked: boolean;
}>;

export type QueenEvent =
  | ({
      type: 'UPDATE_QUEEN';

      payload: QueenPayload;
    } & BaseEvent)
  | ({
      type: 'STOP_QUEEN';
    } & BaseEvent);
