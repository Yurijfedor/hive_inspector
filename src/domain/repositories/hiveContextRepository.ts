import {Task} from '../../types/task';
import {HiveContext} from '../../types/hive';
import {Inspection} from '../../types/inspection';

import {TASK_TYPES} from '../../domain/constants/task';

import {QUEEN_STATUS} from '../../domain/constants/queen';

export class HiveContextRepository {
  buildFromData(
    hiveNumber: number,
    tasks: Task[],
    inspections: Inspection[],
  ): HiveContext {
    // -------------------------
    // hive tasks
    // -------------------------
    const hiveTasks = tasks.filter((t) => t.hiveNumber === hiveNumber);

    // -------------------------
    // hive inspections
    // -------------------------
    const hiveInspections = inspections
      .filter((i) => i.hiveNumber === hiveNumber)
      .sort((a, b) => b.date - a.date);

    const lastInspectionData = hiveInspections[0];

    // -------------------------
    // latest inspection
    // -------------------------
    const lastInspection = lastInspectionData
      ? {
          date: lastInspectionData.date,

          strength: lastInspectionData.strength ?? 0,

          honeyKg: lastInspectionData.honeyKg ?? 0,

          broodFrames: lastInspectionData.broodFrames ?? 0,

          queenStatus: lastInspectionData.queen ?? QUEEN_STATUS.UNKNOWN,
        }
      : undefined;

    // -------------------------
    // normalize task date
    // -------------------------
    const getDate = (d: number | string | undefined) => {
      if (!d) {
        return 0;
      }

      return typeof d === 'string' ? new Date(d).getTime() : d;
    };

    const sortByDateDesc = (a: Task, b: Task) =>
      getDate(b.date) - getDate(a.date);

    // -------------------------
    // feeding
    // -------------------------
    const feedingTasks = hiveTasks
      .filter((t) => t.type === TASK_TYPES.FEEDING)
      .sort(sortByDateDesc);

    // -------------------------
    // swarm
    // -------------------------
    const swarmTasks = hiveTasks
      .filter((t) => t.type === TASK_TYPES.SWARM)
      .sort(sortByDateDesc);

    // -------------------------
    // disease
    // -------------------------
    const diseaseTasks = hiveTasks
      .filter((t) => t.type === TASK_TYPES.DISEASE)
      .sort(sortByDateDesc);

    // -------------------------
    // split
    // -------------------------
    const splitTasks = hiveTasks
      .filter((t) => t.type === TASK_TYPES.SPLIT)
      .sort(sortByDateDesc);

    return {
      hiveNumber,

      lastInspection,

      // -------------------------
      // feeding
      // -------------------------
      feeding: {
        hasFeeding: feedingTasks.length > 0,

        lastFeedingAt: feedingTasks[0]
          ? getDate(feedingTasks[0].date)
          : undefined,
      },

      // -------------------------
      // swarm
      // -------------------------
      swarm: {
        hasSwarmSigns: swarmTasks.length > 0,

        queenEmergence: false,

        sealedCells: false,

        openCells: false,

        eggsInCells: false,
      },

      // -------------------------
      // disease
      // -------------------------
      disease: {
        hasDiseaseSigns: diseaseTasks.length > 0,

        diarrhea: false,

        deformedWings: false,

        mitesVisible: false,

        weakBrood: false,
      },

      // -------------------------
      // split
      // -------------------------
      split: {
        isSplit: splitTasks.length > 0,

        usedForSplits: splitTasks.length > 0,

        totalBroodFrames: 0,

        totalFoodFrames: 0,
      },

      // -------------------------
      // meta
      // -------------------------
      meta: {
        lastInspectionAt: lastInspection?.date,

        lastFeedingAt: feedingTasks[0]
          ? getDate(feedingTasks[0].date)
          : undefined,

        lastDiseaseCheckAt: diseaseTasks[0]
          ? getDate(diseaseTasks[0].date)
          : undefined,

        lastSwarmCheckAt: swarmTasks[0]
          ? getDate(swarmTasks[0].date)
          : undefined,

        lastSplitActionAt: splitTasks[0]
          ? getDate(splitTasks[0].date)
          : undefined,

        hasFeeding: feedingTasks.length > 0,

        hasDiseaseSigns: diseaseTasks.length > 0,

        hasSwarmSigns: swarmTasks.length > 0,

        isSplit: splitTasks.length > 0,

        usedForSplits: splitTasks.length > 0,

        lastStrength: lastInspection?.strength,

        lastBroodFrames: lastInspection?.broodFrames,

        totalBroodFrames: 0,

        totalFoodFrames: 0,
      },
    };
  }
}
