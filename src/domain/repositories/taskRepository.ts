import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import {Task} from '../../types/task';
import {loadTasks, saveTasks} from '../../services/tasks/tasksStorage';
import {mergeTasks} from '../services/taskMergeService';
import {sanitizeFirebaseKey} from '../../utils/firebase/sanitizeKey';
import {deduplicateTasks} from '../../services/tasks/taskUtils';

export class TaskRepository {
  // =============================
  // GET ALL (LOCAL)
  // =============================
  async getAll(): Promise<Task[]> {
    const tasks = await loadTasks();

    return deduplicateTasks(tasks);
  }

  // =============================
  // 🔥 SMART SAVE (LOCAL + DIFF PUSH)
  // =============================
  async saveAll(uid: string, tasks: Task[]): Promise<void> {
    // ✅ 1. LOCAL = source of truth
    await saveTasks(tasks);

    try {
      // ✅ 2. LOAD CLOUD
      const cloudTasks = await this.loadFromFirebase(uid);

      // ✅ 3. DIFF
      const tasksToPush = this.getTasksToPush(tasks, cloudTasks);

      console.log('📤 TASKS TO PUSH:', tasksToPush.length);

      if (tasksToPush.length === 0) {
        console.log('✅ NOTHING TO PUSH');
        return;
      }

      // ✅ 4. BUILD UPDATE
      const updates: Record<string, any> = {};

      const user = auth().currentUser;
      const token = await user?.getIdToken();

      console.log('🔥 USER:', user?.uid);
      console.log('🔥 TOKEN EXISTS:', !!token);

      for (const task of tasksToPush) {
        const safeTaskId = sanitizeFirebaseKey(task.id.toString());

        const path = `users/${uid}/hives/${task.hiveNumber}/tasks/${safeTaskId}`;

        if (task.deleted) {
          updates[path] = null; // 🔥 DELETE
          continue;
        }

        updates[path] = {
          title: task.title,
          type: task.type,
          date: task.date,
          completed: task.completed,
          priority: task.priority ?? null,
          source: 'LOCAL',
          updatedAt: task.updatedAt ?? Date.now(),
        };
      }
      // ✅ 5. PUSH (batch)
      await database().ref().update(updates);

      console.log('☁️ SMART SYNC DONE');
    } catch (e) {
      console.log('⚠️ SMART SYNC FAILED', e);
    }
  }

  // =============================
  // 🔥 DIFF LOGIC
  // =============================
  private getTasksToPush(local: Task[], cloud: Task[]): Task[] {
    const cloudMap = new Map(cloud.map((t) => [t.id, t]));

    const toPush: Task[] = [];

    for (const localTask of local) {
      const cloudTask = cloudMap.get(localTask.id);

      // 🆕 нова задача
      if (!cloudTask) {
        toPush.push(localTask);
        continue;
      }

      // 🔄 локальна новіша
      if ((localTask.updatedAt ?? 0) > (cloudTask.updatedAt ?? 0)) {
        toPush.push(localTask);
      }
    }

    return toPush;
  }

  // =============================
  // MERGE FROM AI
  // =============================
  async mergeFromAI(uid: string, newTasks: Task[]): Promise<Task[]> {
    const existing = await this.getAll();

    const withTimestamps = newTasks.map((t) => ({
      ...t,
      updatedAt: Date.now(),
      source: 'USER' as const,
    }));

    const merged = mergeTasks(existing, withTimestamps);

    await this.saveAll(uid, merged);

    return merged;
  }

  // =============================
  // COMPLETE TASK
  // =============================
  async completeTask(uid: string, taskId: string): Promise<void> {
    const tasks = await this.getAll();

    const now = Date.now();

    const updated = tasks.map((t) =>
      t.id === taskId
        ? {...t, completed: true, updatedAt: now, source: 'USER' as const}
        : t,
    );

    await this.saveAll(uid, updated);
  }

  // =============================
  // 🔽 LOAD FROM FIREBASE
  // =============================
  async loadFromFirebase(uid: string): Promise<Task[]> {
    try {
      const snap = await database().ref(`users/${uid}/hives`).once('value');

      const data = snap.val();
      if (!data) return [];

      const tasks: Task[] = [];

      for (const hiveNumber in data) {
        const hive = data[hiveNumber];

        if (!hive?.tasks) continue;

        for (const taskId in hive.tasks) {
          const t = hive.tasks[taskId];

          tasks.push({
            id: taskId,
            hiveNumber: Number(hiveNumber),
            title: t.title ?? '',
            type: t.type ?? 'UNKNOWN',
            date: t.date ?? '',
            completed: t.completed ?? false,
            priority: t.priority ?? 'normal',
            source: 'CLOUD',
            updatedAt: t.updatedAt ?? 0,
          });
        }
      }

      return tasks;
    } catch (e) {
      console.log('❌ LOAD TASKS FROM FIREBASE FAILED', e);
      return [];
    }
  }

  // =============================
  // 🔄 FULL SYNC (PULL + MERGE)
  // =============================
  async syncWithFirebase(uid: string): Promise<Task[]> {
    const localTasks = await this.getAll();

    const cloudTasks = await Promise.race([
      this.loadFromFirebase(uid),
      new Promise<Task[]>((resolve) => setTimeout(() => resolve([]), 2000)),
    ]);

    console.log('☁️ CLOUD TASKS:', cloudTasks.length);
    console.log('📱 LOCAL TASKS:', localTasks.length);

    const merged = mergeTasks(localTasks, cloudTasks);

    console.log('🔀 MERGED TASKS:', merged.length);

    await saveTasks(merged);

    return merged;
  }
}
