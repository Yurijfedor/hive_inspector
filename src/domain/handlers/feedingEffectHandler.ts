import {FeedingEvent} from '../events/feedingEvents';
import {saveFeeding} from '../repositories/feedingRepository';

export type FeedingEffectResult =
  | {
      kind: 'FEEDING_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'FEEDING_STOPPED';
      hiveNumber: number;
    };

export async function handleFeedingEffect(
  uid: string,
  event: FeedingEvent,
): Promise<FeedingEffectResult> {
  switch (event.type) {
    case 'UPDATE_FEEDING':
      await saveFeeding(uid, {
        hiveNumber: event.hiveNumber,
        ...event.payload,
      });

      return {
        kind: 'FEEDING_UPDATED',
        hiveNumber: event.hiveNumber,
      };

    case 'STOP_FEEDING':
      return {
        kind: 'FEEDING_STOPPED',
        hiveNumber: event.hiveNumber,
      };
  }
}
