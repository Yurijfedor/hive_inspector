export type Task = {
  id: string;
  hiveNumber: number;
  title: string;

  type: TaskType;
  date: number;

  completed: boolean;

  source: 'LLM' | 'USER' | 'SYSTEM' | 'CLOUD';

  priority?: TaskPriority;

  note?: string;

  updatedAt: number;

  deleted?: boolean;
};

export type TaskType =
  | 'FEEDING'
  | 'INSPECTION'
  | 'DISEASE'
  | 'SWARM'
  | 'SPLIT'
  | 'OTHER';

export type CreateTaskInput = {
  title: string;
  hiveNumber: number;
  type: TaskType;
  date: number;
  priority?: TaskPriority;
};

export type TaskPriority = 'PRIMARY' | 'SECONDARY';
