import database from '@react-native-firebase/database';

import {Task, CreateTaskInput} from '../../../types/task';
import {TaskRepository} from '../../repositories/taskRepository';
import {TASK_SOURCES} from '../../constants/task';

export async function createTask(uid: string, input: CreateTaskInput) {
  const repo = new TaskRepository();

  const id = database().ref().push().key;

  const existing = await repo.getAll();

  const newTask: Task = {
    id,
    title: input.title,
    hiveNumber: input.hiveNumber,
    type: input.type,
    date: input.date,
    completed: false,

    priority: input.priority,

    updatedAt: Date.now(),
    source: TASK_SOURCES.USER,
  };

  const updated = [...existing, newTask];

  await repo.saveAll(uid, updated);

  return newTask;
}
