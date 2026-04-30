import {Task} from '../types/task';
import {ApiaryCategory} from '../domain/apiary';

export type RootStackParamList = {
  // 🧪 DEV
  Dev: undefined;

  // 🏠 MAIN
  Apiary: undefined;

  // 📋 TASKS
  TasksList: {
    hiveNumber?: number | undefined;
  };

  Tasks: {
    initialTasks: Task[];
  };

  TaskCreate: undefined;

  TaskEdit: {
    task: Task;
  };

  Today: undefined;

  // 🐝 HIVE
  Hive: {
    hiveNumber: number;
  };

  ManualInspection: {
    hiveNumber: number;
  };

  InspectionHistory: {
    hiveNumber: number;
  };

  // 📊 APIARY
  ApiaryCategory: {
    category: ApiaryCategory;
  };

  // 👤 PROFILE
  Profile: undefined;

  HiveCreate: undefined;
};
