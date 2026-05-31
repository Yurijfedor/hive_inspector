import {Task} from '../../../types/task';

export const groupTasksByDay = (tasks: Task[]) => {
  const result: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    if (task.completed) {
      return;
    }

    const key = new Date(task.date).toISOString().split('T')[0];

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(task);
  });

  return result;
};
