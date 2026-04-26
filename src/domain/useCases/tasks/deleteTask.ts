import {TaskRepository} from '../../repositories/taskRepository';

export async function deleteTask(uid: string, taskId: string) {
  const repo = new TaskRepository();

  const tasks = await repo.getAll();

  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          deleted: true,
          updatedAt: Date.now(),
          source: 'USER' as const,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
