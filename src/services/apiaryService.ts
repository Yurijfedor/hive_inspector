import {TaskRepository} from '../domain/repositories/taskRepository';
import {HiveContextRepository} from '../domain/repositories/hiveContextRepository';
import {ApiarySummary} from '../domain/apiary';
import {loadInspections} from '../persistence/inspectionRepository';

const NO_INSPECTION_DAYS = 7;

export async function getApiarySummary(_uid: string): Promise<ApiarySummary> {
  const taskRepo = new TaskRepository();
  const hiveContextRepo = new HiveContextRepository();

  // 📦 1. отримуємо всі задачі (local-first)
  const tasks = await taskRepo.getAll();
  const inspections = await loadInspections(_uid);

  // 🧠 2. групуємо по вуликах
  const hiveNumbers = Array.from(new Set(tasks.map((t) => t.hiveNumber)));

  let noInspectionCount = 0;
  let needsFeedingCount = 0;
  let problemHivesCount = 0;

  const now = Date.now();

  // 🐝 3. будуємо HiveContext для кожного вулика
  for (const hiveNumber of hiveNumbers) {
    const context = hiveContextRepo.buildFromData(
      hiveNumber,
      tasks,
      inspections,
    );

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

    const strength = context.lastInspection?.strength ?? 0;
    const honey = context.lastInspection?.honeyKg ?? 0;
    console.log(`context: ${JSON.stringify(context)}`);

    console.log(`сила: ${strength}; мед: ${honey} `);

    const needsFeeding = strength > 0 && honey < strength * 1.5;

    if (needsFeeding) {
      needsFeedingCount++;
    }

    // ⚠️ проблеми
    const RECENT_DAYS = 3 * 24 * 60 * 60 * 1000;

    const hasRecentDisease =
      context.disease?.lastDiseaseCheck &&
      now - context.disease.lastDiseaseCheck < RECENT_DAYS;

    const hasRecentSwarm =
      context.swarm?.lastSwarmCheck &&
      now - context.swarm.lastSwarmCheck < RECENT_DAYS;

    if (hasRecentDisease || hasRecentSwarm) {
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
