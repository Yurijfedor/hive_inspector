import {TaskRepository} from '../repositories/taskRepository';
import {autoCompleteTasks, EventType} from './autoCompleteTasks';

const repo = new TaskRepository();

export async function applyTaskAutoComplete(
  uid: string,
  hiveNumber: number,
  eventType: EventType,
) {
  try {
    const tasks = await repo.getAll();

    const updated = autoCompleteTasks(tasks, hiveNumber, eventType);

    const hasChanges = updated.some((t, i) => t !== tasks[i]);

    if (!hasChanges) return;

    await repo.saveAll(uid, updated);

    console.log(`✅ ${eventType} → tasks auto-completed`);
  } catch (e) {
    console.log('❌ AUTO COMPLETE FAILED', e);
  }
}
