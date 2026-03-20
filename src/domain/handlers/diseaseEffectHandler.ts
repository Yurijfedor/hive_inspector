import {DiseaseEvent} from '../events/diseaseEvents';
import {saveDisease} from '../repositories/diseaseRepository';

export type DiseaseEffectResult =
  | {
      kind: 'DISEASE_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'DISEASE_STOPPED';
      hiveNumber: number;
    };

export async function handleDiseaseEffect(
  uid: string,
  event: DiseaseEvent,
): Promise<DiseaseEffectResult> {
  switch (event.type) {
    case 'UPDATE_DISEASE':
      await saveDisease(uid, {
        hiveNumber: event.hiveNumber,
        ...event.payload,
      });

      return {
        kind: 'DISEASE_UPDATED',
        hiveNumber: event.hiveNumber,
      };

    case 'STOP_DISEASE':
      return {
        kind: 'DISEASE_STOPPED',
        hiveNumber: event.hiveNumber,
      };
  }
}
