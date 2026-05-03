import {Task} from '../../types/task';
import {HiveContext} from '../../types/hive';
import {Inspection} from '../../types/inspection';

export class HiveContextRepository {
  buildFromData(
    hiveNumber: number,
    tasks: Task[],
    inspections: Inspection[],
  ): HiveContext {
    // 🔹 tasks цього вулика
    const hiveTasks = tasks.filter((t) => t.hiveNumber === hiveNumber);

    // 🔹 inspections цього вулика
    const hiveInspections = inspections
      .filter((i) => i.hiveNumber === hiveNumber)
      .sort((a, b) => b.date - a.date);

    const lastInspectionData = hiveInspections[0];

    // 🕵️ ОСТАННІЙ ОГЛЯД (тепер з реальних даних)
    const lastInspection = lastInspectionData
      ? {
          date: lastInspectionData.date,
          strength: lastInspectionData.strength ?? 0,
          honeyKg: lastInspectionData.honeyKg ?? 0,
          broodFrames: lastInspectionData.broodFrames ?? 0,
          hasQueen: lastInspectionData.queen.present === true ? true : false,
        }
      : null;

    // 🔧 нормалізація дати (для tasks)
    const getDate = (d: number | string | undefined) => {
      if (!d) return 0;
      return typeof d === 'string' ? new Date(d).getTime() : d;
    };

    const sortByDateDesc = (a: Task, b: Task) =>
      getDate(b.date) - getDate(a.date);

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
