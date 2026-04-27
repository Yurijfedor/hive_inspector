import {Task} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';
// import {markTaskUpdated} from '../../tasks/taskFactory';

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
          source: 'USER' as const,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
