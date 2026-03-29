import {FeedingEvent} from '../events/feedingEvents';
import {saveFeeding} from '../repositories/feedingRepository';

import {TaskRepository} from '../repositories/taskRepository';
import {autoCompleteTasks} from '../tasks/autoCompleteTasks';

export type FeedingEffectResult =
  | {
      kind: 'FEEDING_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'FEEDING_STOPPED';
      hiveNumber: number;
    };

const taskRepo = new TaskRepository();

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

      // 🔥 AUTO COMPLETE TASKS
      try {
        const tasks = await taskRepo.getAll();

        const updated = autoCompleteTasks(tasks, event.hiveNumber, 'FEEDING');

        // 👉 перевірка чи є зміни
        const hasChanges = updated.some((t, i) => t !== tasks[i]);

        if (hasChanges) {
          await taskRepo.saveAll(uid, updated);
          console.log('✅ FEEDING → tasks auto-completed');
        } else {
          console.log('ℹ️ FEEDING → no tasks to complete');
        }
      } catch (e) {
        console.log('❌ AUTO COMPLETE FAILED', e);
      }

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
