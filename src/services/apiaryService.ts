import {TaskRepository} from '../domain/repositories/taskRepository';
import {HiveContextRepository} from '../domain/repositories/hiveContextRepository';
import {ApiarySummary} from '../domain/apiary';

const NO_INSPECTION_DAYS = 7;

export async function getApiarySummary(_uid: string): Promise<ApiarySummary> {
  const taskRepo = new TaskRepository();
  const hiveContextRepo = new HiveContextRepository();

  // 📦 1. отримуємо всі задачі (local-first)
  const tasks = await taskRepo.getAll();

  // 🧠 2. групуємо по вуликах
  const hiveNumbers = Array.from(new Set(tasks.map((t) => t.hiveNumber)));

  let noInspectionCount = 0;
  let needsFeedingCount = 0;
  let problemHivesCount = 0;

  const now = Date.now();

  // 🐝 3. будуємо HiveContext для кожного вулика
  for (const hiveNumber of hiveNumbers) {
    const context = hiveContextRepo.buildFromTasks(hiveNumber, tasks);

    // ❌ немає інспекції
    if (!context.lastInspection?.date) {
      noInspectionCount++;
    } else {
      const daysDiff =
        (now - context.lastInspection.date) / (1000 * 60 * 60 * 24);

      if (daysDiff > NO_INSPECTION_DAYS) {
        noInspectionCount++;
      }
    }

    // 🍯 feeding
    if (!context.feeding?.hasFeeding) {
      needsFeedingCount++;
    }

    // ⚠️ проблеми
    if (context.disease?.hasDiseaseSigns || context.swarm?.hasSwarmSigns) {
      problemHivesCount++;
    }
  }

  return {
    totalHives: hiveNumbers.length,
    noInspectionCount,
    needsFeedingCount,
    problemHivesCount,
  };
}
