import {Task} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';
import {markTaskUpdated} from '../../tasks/taskFactory';

export async function updateTask(uid: string, task: Task) {
  const repo = new TaskRepository();

  const tasks = await repo.getAll();

  const updated = tasks.map((t) =>
    t.id === task.id ? markTaskUpdated(task) : t,
  );

  await repo.saveAll(uid, updated);
}
