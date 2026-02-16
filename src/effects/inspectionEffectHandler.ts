import {InspectionEvent} from '../actions/inspectionEvents';
import {saveInspection} from '../persistence/inspectionRepository';
import {InspectionEffectResult} from './types';

export async function handleInspectionEffect(
  event: InspectionEvent,
): Promise<InspectionEffectResult> {
  switch (event.type) {
    case 'STOP_INSPECTION':
      await saveInspection({
        hiveNumber: event.hiveNumber,
        stop: true,
      } as any);

      return {
        kind: 'STOPPED',
        hiveNumber: event.hiveNumber,
      };

    case 'UPDATE_INSPECTION':
      await saveInspection({
        hiveNumber: event.hiveNumber,
        ...event.payload,
      } as any);

      return {
        kind: 'UPDATED',
        hiveNumber: event.hiveNumber,
        payload: {
          strength: event.payload.strength ?? null,
          honeyKg: event.payload.honeyKg ?? null,
          queen: event.payload.queen ?? null,
        },
      };
  }
}
