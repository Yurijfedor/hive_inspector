import {Task} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function createTask(uid: string, task: Omit<Task, 'id'>) {
  const repo = new TaskRepository();

  const existing = await repo.getAll();

  const newTask: Task = {
    ...task,
    id: generateId(),
    completed: false,
    updatedAt: Date.now(),
    source: 'USER',
  };

  const updated = [...existing, newTask];

  await repo.saveAll(uid, updated);

  return newTask;
}
