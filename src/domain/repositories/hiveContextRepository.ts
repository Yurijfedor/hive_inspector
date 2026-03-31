import {Task} from '../../types/task';
import {HiveContext} from '../../types/hive';

export class HiveContextRepository {
  buildFromTasks(hiveNumber: number, tasks: Task[]): HiveContext {
    const hiveTasks = tasks.filter((t) => t.hiveNumber === hiveNumber);

    // 🔧 нормалізація дати
    const getDate = (d: number | string) =>
      typeof d === 'string' ? new Date(d).getTime() : d;

    // 🕵️ останній огляд
    const inspections = hiveTasks
      .filter((t) => t.type === 'INSPECTION')
      .sort((a, b) => getDate(b.date) - getDate(a.date));

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
    const feedingTasks = hiveTasks.filter((t) => t.type === 'FEEDING');

    // 🔴 SWARM
    const swarmTasks = hiveTasks.filter((t) => t.type === 'SWARM');

    // 🟣 DISEASE
    const diseaseTasks = hiveTasks.filter((t) => t.type === 'DISEASE');

    // 🔵 SPLIT
    const splitTasks = hiveTasks.filter((t) => t.type === 'SPLIT');

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
