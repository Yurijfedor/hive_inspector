import {SplitEvent} from '../events/splitEvents';
import {saveSplit} from '../repositories/splitRepository';

import {TaskRepository} from '../repositories/taskRepository';
import {autoCompleteTasks} from '../tasks/autoCompleteTasks';

export type SplitEffectResult =
  | {
      kind: 'SPLIT_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'SPLIT_STOPPED';
      hiveNumber: number;
    };

const taskRepo = new TaskRepository();

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

      // 🔥 AUTO COMPLETE TASKS
      try {
        const tasks = await taskRepo.getAll();

        const updated = autoCompleteTasks(tasks, event.hiveNumber, 'SPLIT');

        const hasChanges = updated.some((t, i) => t !== tasks[i]);

        if (hasChanges) {
          await taskRepo.saveAll(uid, updated);
          console.log('✅ SPLIT → tasks auto-completed');
        } else {
          console.log('ℹ️ SPLIT → no tasks to complete');
        }
      } catch (e) {
        console.log('❌ AUTO COMPLETE FAILED', e);
      }

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
