import database from '@react-native-firebase/database';

import {Task} from '../../types/task';
import {loadTasks, saveTasks} from '../../services/tasks/tasksStorage';
import {mergeTasks} from '../services/taskMergeService';
import {sanitizeFirebaseKey} from '../../utils/firebase/sanitizeKey';

export class TaskRepository {
  async getAll(): Promise<Task[]> {
    return await loadTasks();
  }

  async saveAll(uid: string, tasks: Task[]): Promise<void> {
    // ✅ 1. LOCAL (source of truth)
    await saveTasks(tasks);

    // ✅ 2. FIREBASE (sync)
    const updates: Record<string, any> = {};

    for (const task of tasks) {
      const safeTaskId = sanitizeFirebaseKey(task.id.toString());

      const basePath = `users/${uid}/hives/${task.hiveNumber}/tasks/${safeTaskId}`;

      updates[basePath] = {
        title: task.title,
        type: task.type,
        date: task.date,
        completed: task.completed,
        priority: task.priority ?? null,
        source: task.source,
        updatedAt: database.ServerValue.TIMESTAMP,
      };
    }

    try {
      await database().ref().update(updates);
      console.log('☁️ TASKS SYNCED');
    } catch (e) {
      console.log('⚠️ TASKS SYNC FAILED', e);
    }
  }

  async mergeFromAI(uid: string, newTasks: Task[]): Promise<Task[]> {
    const existing = await this.getAll();

    const merged = mergeTasks(existing, newTasks);

    await this.saveAll(uid, merged);

    return merged;
  }

  async completeTask(uid: string, taskId: string): Promise<void> {
    const tasks = await this.getAll();

    const updated = tasks.map((t) =>
      t.id === taskId ? {...t, completed: true} : t,
    );

    await this.saveAll(uid, updated);
  }
}
