import {InspectionEvent} from '../actions/inspectionEvents';
import {saveInspection} from '../persistence/inspectionRepository';
import {InspectionEffectResult} from './types';
import {generateTasksForHive} from '../services/ai/generateTasks';

import {applyTaskAutoComplete} from '../domain/tasks/applyTaskAutoComplete';

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

      // 🔥 закриваємо старі inspection tasks
      await applyTaskAutoComplete(uid, event.hiveNumber, 'INSPECTION');

      // 🔥 генеруємо нові задачі
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
        broodFrames: event.payload?.broodFrames,
        queen: event.payload?.queen,
        syrupLiters: event.payload?.syrupLiters,
      };
      console.log(command);

      await saveInspection(uid, command);

      return {
        kind: 'UPDATED',
        hiveNumber: event.hiveNumber,
        payload: {
          strength: command.strength ?? null,
          honeyKg: command.honeyKg ?? null,
          queen: command.queen ?? null,
          broodFrames: command.broodFrames ?? null,
          syrupLiters: command.syrupLiters ?? null,
        },
      };
    }
  }
}
