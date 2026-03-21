import {SplitEvent} from '../events/splitEvents';
import {saveSplit} from '../repositories/splitRepository';

export type SplitEffectResult =
  | {
      kind: 'SPLIT_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'SPLIT_STOPPED';
      hiveNumber: number;
    };

export async function handleSplitEffect(
  uid: string,
  event: SplitEvent,
): Promise<SplitEffectResult> {
  switch (event.type) {
    case 'UPDATE_SPLIT':
      await saveSplit(uid, {
        hiveNumber: event.hiveNumber,
        ...event.payload,
      });

      return {
        kind: 'SPLIT_UPDATED',
        hiveNumber: event.hiveNumber,
      };

    case 'STOP_SPLIT':
      return {
        kind: 'SPLIT_STOPPED',
        hiveNumber: event.hiveNumber,
      };
  }
}
