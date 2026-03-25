import {Task} from '../types/task';

export type RootStackParamList = {
  Dev: undefined;
  Tasks: {
    initialTasks: Task[];
  };
};
