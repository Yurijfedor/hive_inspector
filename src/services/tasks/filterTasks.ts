import {Task, TaskType, TaskPriority} from '../../types/task';

export type TaskStatusFilter = 'ALL' | 'ACTIVE' | 'COMPLETED';

export type TaskFilters = {
  hiveNumber?: number;
  type?: TaskType;
  priority?: TaskPriority;
  status?: TaskStatusFilter; // 👈 ДОДАЛИ
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

    // 🔥 STATUS FILTER
    if (filters.status === 'ACTIVE' && task.completed) {
      return false;
    }

    if (filters.status === 'COMPLETED' && !task.completed) {
      return false;
    }

    return true;
  });
};
