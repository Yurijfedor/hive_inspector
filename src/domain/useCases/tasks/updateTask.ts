import {Task} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';
import {TASK_SOURCES} from '../../constants/task';

export async function updateTask(uid: string, task: Task) {
  const repo = new TaskRepository();

  const tasks = await repo.getAll();

  const existing = tasks.find((t) => t.id === task.id);

  if (!existing) {
    throw new Error('Task not found');
  }

  // 🔒 DOMAIN RULE: hive не можна змінювати
  if (task.hiveNumber !== existing.hiveNumber) {
    throw new Error('Hive number cannot be changed');
  }

  const now = Date.now();

  const updated = tasks.map((t) =>
    t.id === task.id
      ? {
          ...task,
          updatedAt: now,
          source: TASK_SOURCES.USER,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
