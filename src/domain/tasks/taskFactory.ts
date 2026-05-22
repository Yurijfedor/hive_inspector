import {Task} from '../../types/task';
import {TASK_SOURCES} from '../constants/task';

export function markTaskUpdated(task: Task): Task {
  return {
    ...task,
    updatedAt: Date.now(),
    source: TASK_SOURCES.USER,
  };
}
