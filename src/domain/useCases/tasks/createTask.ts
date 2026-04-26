import {Task, CreateTaskInput} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function createTask(uid: string, input: CreateTaskInput) {
  const repo = new TaskRepository();

  const existing = await repo.getAll();

  const newTask: Task = {
    id: generateId(),
    title: input.title,
    hiveNumber: input.hiveNumber,
    type: input.type,
    date: input.date,
    completed: false,

    priority: input.priority,

    updatedAt: Date.now(),
    source: 'USER',
  };

  const updated = [...existing, newTask];

  await repo.saveAll(uid, updated);

  return newTask;
}
