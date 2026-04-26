import {TaskRepository} from '../../repositories/taskRepository';

export async function toggleTask(uid: string, taskId: string) {
  const repo = new TaskRepository();

  const tasks = await repo.getAll();

  const now = Date.now();

  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          completed: !t.completed,
          updatedAt: now,
          source: 'USER' as const,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
