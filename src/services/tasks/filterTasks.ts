import {Task, TaskType, TaskPriority} from '../../types/task';

export type TaskFilters = {
  hiveNumber?: number;
  type?: TaskType;
  priority?: TaskPriority;
};

export const filterTasks = (tasks: Task[], filters: TaskFilters) => {
  return tasks.filter((task) => {
    if (filters.hiveNumber && task.hiveNumber !== filters.hiveNumber) {
      return false;
    }

    if (filters.type && task.type !== filters.type) {
      return false;
    }

    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
};
