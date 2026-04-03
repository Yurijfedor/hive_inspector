import {QueenEvent} from '../events/queenEvents';
import {updateQueen} from '../repositories/queenRepository';

export type QueenEffectResult =
  | {
      kind: 'QUEEN_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'QUEEN_STOPPED';
      hiveNumber: number;
    };

export async function handleQueenEffect(
  uid: string,
  event: QueenEvent,
): Promise<QueenEffectResult> {
  switch (event.type) {
    case 'UPDATE_QUEEN':
      await updateQueen(uid, event.hiveNumber, event.payload);

      return {
        kind: 'QUEEN_UPDATED',
        hiveNumber: event.hiveNumber,
      };

    case 'STOP_QUEEN':
      return {
        kind: 'QUEEN_STOPPED',
        hiveNumber: event.hiveNumber,
      };
  }
}
