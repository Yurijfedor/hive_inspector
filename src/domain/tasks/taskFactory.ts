import {Task} from '../../types/task';

export function markTaskUpdated(task: Task): Task {
  return {
    ...task,
    updatedAt: Date.now(),
    source: 'USER', // тут вже тип зафіксований
  };
}
