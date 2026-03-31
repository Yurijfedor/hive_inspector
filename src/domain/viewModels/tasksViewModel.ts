import {Task} from '../../types/task';

export type TasksViewModel = {
  today: Record<string, Task[]>;

  upcoming: {
    date: number;
    tasks: Task[];
  }[];

  stats: {
    totalToday: number;
    byType: Record<string, number>;
  };
};
