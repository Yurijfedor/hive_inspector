import {TaskRepository} from '../../repositories/taskRepository';
import {TASK_SOURCES} from '../../constants/task';

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
          source: TASK_SOURCES.USER,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
