import {Task} from '../types/task';
import {ApiaryCategory} from '../domain/apiary';

export type RootStackParamList = {
  Dev: undefined;

  Tasks: {
    initialTasks: Task[];
  };

  Hive: {
    hiveNumber: number;
  };

  ManualInspection: {
    hiveNumber: number;
  };

  InspectionHistory: {
    hiveNumber: number;
  };

  ApiaryCategory: {
    category: ApiaryCategory;
  };

  Profile: undefined;
};
