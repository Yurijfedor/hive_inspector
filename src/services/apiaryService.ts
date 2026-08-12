import {TaskRepository} from '../domain/repositories/taskRepository';
import {HiveContextRepository} from '../domain/repositories/hiveContextRepository';
import {ApiarySummary} from '../domain/apiary';
import {loadInspections} from '../persistence/inspectionRepository';
import {HiveContextRepository as LocalHiveContextRepository} from '../persistence/hiveContextRepository';

const NO_INSPECTION_DAYS = 7;

export async function getApiarySummary(_uid: string): Promise<ApiarySummary> {
  const taskRepo = new TaskRepository();

  const hiveContextRepo = new HiveContextRepository();
  const localHiveContextRepo = new LocalHiveContextRepository();

  // --------------------------------------------------
  // 1. LOCAL DATA
  // --------------------------------------------------

  const tasks = await taskRepo.getAll();
  const inspections = await loadInspections(_uid);
  const syncedContexts = await localHiveContextRepo.loadAll();

  console.log('📊 APIARY TASKS:', tasks.length);
  console.log('📊 APIARY INSPECTIONS:', inspections.length);
  console.log('📊 APIARY SYNCED CONTEXTS:', syncedContexts.length);

  // --------------------------------------------------
  // 2. ВИЗНАЧАЄМО ВСІ ВУЛИКИ
  // --------------------------------------------------

  const hiveNumbers = Array.from(
    new Set([
      ...tasks.map((t) => t.hiveNumber),
      ...inspections.map((i) => i.hiveNumber),
      ...syncedContexts.map((c) => c.hiveNumber),
    ]),
  );

  console.log('🐝 APIARY HIVE NUMBERS:', hiveNumbers);

  // --------------------------------------------------
  // 3. COUNTERS
  // --------------------------------------------------

  let noInspectionCount = 0;
  let needsFeedingCount = 0;
  let problemHivesCount = 0;

  const now = Date.now();

  // --------------------------------------------------
  // 4. BUILD CONTEXT FOR EVERY HIVE
  // --------------------------------------------------

  for (const hiveNumber of hiveNumbers) {
    const context = hiveContextRepo.buildFromData(
      hiveNumber,
      tasks,
      inspections,
    );

    // --------------------------------------------------
    // Якщо локально синхронізований context містить
    // інформацію, якої немає в tasks/inspections,
    // використовуємо його як fallback.
    // --------------------------------------------------

    const syncedContext = syncedContexts.find(
      (c) => c.hiveNumber === hiveNumber,
    );

    const effectiveContext =
      context?.lastInspection ||
      context?.feeding?.hasFeeding ||
      context?.swarm?.hasSwarmSigns ||
      context?.disease?.hasDiseaseSigns ||
      context?.split?.isSplit
        ? context
        : syncedContext ?? context;

    // --------------------------------------------------
    // NO INSPECTION
    // --------------------------------------------------

    if (!effectiveContext.lastInspection?.date) {
      noInspectionCount++;
    } else {
      const daysDiff =
        (now - effectiveContext.lastInspection.date) / (1000 * 60 * 60 * 24);

      if (daysDiff > NO_INSPECTION_DAYS) {
        noInspectionCount++;
      }
    }

    // --------------------------------------------------
    // FEEDING
    // --------------------------------------------------

    const strength = effectiveContext.lastInspection?.strength ?? 0;
    const honey = effectiveContext.lastInspection?.honeyKg ?? 0;

    const needsFeeding = strength > 0 && honey < strength * 1.5;

    if (needsFeeding) {
      needsFeedingCount++;
    }

    // --------------------------------------------------
    // PROBLEMS
    // --------------------------------------------------

    const RECENT_DAYS = 3 * 24 * 60 * 60 * 1000;

    const hasRecentDisease =
      effectiveContext.disease?.updatedAt &&
      now - effectiveContext.disease.updatedAt < RECENT_DAYS;

    const hasRecentSwarm =
      effectiveContext.swarm?.updatedAt &&
      now - effectiveContext.swarm.updatedAt < RECENT_DAYS;

    if (hasRecentDisease || hasRecentSwarm) {
      problemHivesCount++;
    }
  }

  // --------------------------------------------------
  // 5. RESULT
  // --------------------------------------------------

  return {
    totalHives: hiveNumbers.length,
    noInspectionCount,
    needsFeedingCount,
    problemHivesCount,
  };
}
