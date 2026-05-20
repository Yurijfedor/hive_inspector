import {
  TASK_PRIORITIES,
  TASK_SOURCES,
  TASK_TYPES,
} from '../domain/constants/task';

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];

export type TaskPriority =
  (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export type TaskSource = (typeof TASK_SOURCES)[keyof typeof TASK_SOURCES];

export type Task = {
  id: string;

  hiveNumber: number;

  title: string;

  type: TaskType;

  date: number;

  completed: boolean;

  source: TaskSource;

  priority?: TaskPriority;

  note?: string;

  updatedAt: number;

  deleted?: boolean;
};

export type CreateTaskInput = {
  title: string;

  hiveNumber: number;

  type: TaskType;

  date: number;

  priority?: TaskPriority;
};
