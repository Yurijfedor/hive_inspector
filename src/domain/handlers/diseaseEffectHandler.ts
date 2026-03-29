import {DiseaseEvent} from '../events/diseaseEvents';
import {saveDisease} from '../repositories/diseaseRepository';

import {TaskRepository} from '../repositories/taskRepository';
import {autoCompleteTasks} from '../tasks/autoCompleteTasks';

export type DiseaseEffectResult =
  | {
      kind: 'DISEASE_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'DISEASE_STOPPED';
      hiveNumber: number;
    };

const taskRepo = new TaskRepository();

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

      // 🔥 AUTO COMPLETE TASKS
      try {
        const tasks = await taskRepo.getAll();

        const updated = autoCompleteTasks(tasks, event.hiveNumber, 'DISEASE');

        const hasChanges = updated.some((t, i) => t !== tasks[i]);

        if (hasChanges) {
          await taskRepo.saveAll(uid, updated);
          console.log('✅ DISEASE → tasks auto-completed');
        } else {
          console.log('ℹ️ DISEASE → no tasks to complete');
        }
      } catch (e) {
        console.log('❌ AUTO COMPLETE FAILED', e);
      }

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
