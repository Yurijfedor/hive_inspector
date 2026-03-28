import {InspectionEvent} from '../actions/inspectionEvents';
import {saveInspection} from '../persistence/inspectionRepository';
import {InspectionEffectResult} from './types';
import {generateTasksForHive} from '../services/ai/generateTasks';

export async function handleInspectionEffect(
  uid: string,
  event: InspectionEvent,
): Promise<InspectionEffectResult> {
  switch (event.type) {
    case 'STOP_INSPECTION':
      await saveInspection(uid, {
        hiveNumber: event.hiveNumber,
        stop: true,
      });

      // 🔥 ТРИГЕР AI
      await generateTasksForHive(uid, event.hiveNumber);

      return {
        kind: 'STOPPED',
        hiveNumber: event.hiveNumber,
      };

    case 'UPDATE_INSPECTION': {
      const command = {
        hiveNumber: event.hiveNumber,
        strength: event.payload?.strength,
        honeyKg: event.payload?.honeyKg,
        queen: event.payload?.queen,
        syrupLiters: event.payload?.syrupLiters,
      };

      await saveInspection(uid, command);

      return {
        kind: 'UPDATED',
        hiveNumber: event.hiveNumber,
        payload: {
          strength: command.strength ?? null,
          honeyKg: command.honeyKg ?? null,
          queen: command.queen ?? null,
          syrupLiters: command.syrupLiters ?? null,
        },
      };
    }
  }
}
