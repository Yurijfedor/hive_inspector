import {BaseEvent} from './baseEvent';

export type QueenPayload = Partial<{
  status: 'present' | 'absent' | 'unknown';
  breed: 'карніка' | 'бакфаст' | 'місцева' | 'невідомо';
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
