import {Task} from '../../types/task';
import {loadTasks, saveTasks} from '../../services/tasks/tasksStorage';
import {mergeTasks} from '../services/taskMergeService';

export class TaskRepository {
  async getAll(): Promise<Task[]> {
    return await loadTasks();
  }

  async saveAll(tasks: Task[]): Promise<void> {
    await saveTasks(tasks);
  }

  async mergeFromAI(newTasks: Task[]): Promise<Task[]> {
    const existing = await this.getAll();

    const merged = mergeTasks(existing, newTasks);

    await this.saveAll(merged);

    return merged;
  }

  async completeTask(taskId: string): Promise<void> {
    const tasks = await this.getAll();

    const updated = tasks.map((t) =>
      t.id === taskId ? {...t, completed: true} : t,
    );

    await this.saveAll(updated);
  }
}
