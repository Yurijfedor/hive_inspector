import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '../../types/task';

const TASKS_KEY = 'TASKS_V1';

// 💾 збереження
export const saveTasks = async (tasks: Task[]) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    console.log('✅ TASKS SAVED');
  } catch (e) {
    console.log('❌ SAVE ERROR:', e);
  }
};

// 📥 отримання
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASKS_KEY);

    if (!data) return [];

    return JSON.parse(data);
  } catch (e) {
    console.log('❌ LOAD ERROR:', e);
    return [];
  }
};

// 🧹 очистка (на майбутнє)
export const clearTasks = async () => {
  await AsyncStorage.removeItem(TASKS_KEY);
};
