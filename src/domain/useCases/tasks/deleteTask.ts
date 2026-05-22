import {TaskRepository} from '../../repositories/taskRepository';

import {TASK_SOURCES} from '../../constants/task';

export async function deleteTask(uid: string, taskId: string) {
  const repo = new TaskRepository();

  const tasks = await repo.getAll();

  const updated = tasks.map((t) =>
    t.id === taskId
      ? {
          ...t,

          deleted: true,

          updatedAt: Date.now(),

          source: TASK_SOURCES.USER,
        }
      : t,
  );

  await repo.saveAll(uid, updated);
}
