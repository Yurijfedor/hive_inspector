import {Task} from '../../types/task';
import {HiveContext} from '../../types/hive';

export class HiveContextRepository {
  buildFromTasks(hiveNumber: number, tasks: Task[]): HiveContext {
    const hiveTasks = tasks.filter((t) => t.hiveNumber === hiveNumber);

    // 🔧 нормалізація дати (safe)
    const getDate = (d: number | string | undefined) => {
      if (!d) return 0;
      return typeof d === 'string' ? new Date(d).getTime() : d;
    };

    const sortByDateDesc = (a: Task, b: Task) =>
      getDate(b.date) - getDate(a.date);

    // 🕵️ останній огляд
    const inspections = hiveTasks
      .filter((t) => t.type === 'INSPECTION')
      .sort(sortByDateDesc);

    const lastInspectionTask = inspections[0];

    const lastInspection = lastInspectionTask
      ? {
          date: getDate(lastInspectionTask.date),
          strength: 0,
          honeyKg: 0,
          hasQueen: true,
        }
      : null;

    // 🟡 FEEDING
    const feedingTasks = hiveTasks
      .filter((t) => t.type === 'FEEDING')
      .sort(sortByDateDesc);

    // 🔴 SWARM
    const swarmTasks = hiveTasks
      .filter((t) => t.type === 'SWARM')
      .sort(sortByDateDesc);

    // 🟣 DISEASE
    const diseaseTasks = hiveTasks
      .filter((t) => t.type === 'DISEASE')
      .sort(sortByDateDesc);

    // 🔵 SPLIT
    const splitTasks = hiveTasks
      .filter((t) => t.type === 'SPLIT')
      .sort(sortByDateDesc);

    return {
      hiveNumber,

      lastInspection,

      feeding: {
        hasFeeding: feedingTasks.length > 0,
        lastFeedingAt: feedingTasks[0]
          ? getDate(feedingTasks[0].date)
          : undefined,
      },

      swarm: {
        hasSwarmSigns: swarmTasks.length > 0,
        lastSwarmCheck: swarmTasks[0] ? getDate(swarmTasks[0].date) : undefined,
      },

      disease: {
        hasDiseaseSigns: diseaseTasks.length > 0,
        lastDiseaseCheck: diseaseTasks[0]
          ? getDate(diseaseTasks[0].date)
          : undefined,
      },

      split: {
        isSplit: splitTasks.length > 0,
        usedForSplits: splitTasks.length > 0,
        lastSplitActionAt: splitTasks[0]
          ? getDate(splitTasks[0].date)
          : undefined,
      },

      meta: {
        lastInspectionAt: lastInspection?.date,
        lastFeedingAt: feedingTasks[0]
          ? getDate(feedingTasks[0].date)
          : undefined,

        hasFeeding: feedingTasks.length > 0,
        hasDiseaseSigns: diseaseTasks.length > 0,
        hasSwarmSigns: swarmTasks.length > 0,

        lastStrength: lastInspection?.strength,
      },
    };
  }
}
