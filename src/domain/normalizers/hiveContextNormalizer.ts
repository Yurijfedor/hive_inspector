import type {HiveContext} from '../../types/hive';

import {normalizeBooleanValue} from './normalizeBooleanValue';

export function normalizeHiveContext(input: unknown): HiveContext {
  const raw = (input ?? {}) as Partial<HiveContext>;

  return {
    hiveNumber: Number(raw.hiveNumber ?? 0),

    queen: raw.queen
      ? {
          status: raw.queen.status ?? 'unknown',

          breed: raw.queen.breed,

          birthYear: raw.queen.birthYear,

          marked: raw.queen.marked ?? false,

          lastSeenAt: raw.queen.lastSeenAt,

          updatedAt: raw.queen.updatedAt ?? 0,
        }
      : undefined,

    lastInspection: raw.lastInspection
      ? {
          date: raw.lastInspection.date ?? 0,

          strength: raw.lastInspection.strength ?? 0,

          honeyKg: raw.lastInspection.honeyKg ?? 0,

          broodFrames: raw.lastInspection.broodFrames,

          queenStatus: raw.lastInspection.queenStatus,
        }
      : undefined,

    feeding: raw.feeding
      ? {
          hasFeeding: normalizeBooleanValue(raw.feeding.hasFeeding),

          syrupLiters: raw.feeding.syrupLiters,

          lastFeedingAt: raw.feeding.lastFeedingAt,
        }
      : undefined,

    disease: raw.disease
      ? {
          disease: raw.disease.disease,

          hasDiseaseSigns: normalizeBooleanValue(raw.disease.hasDiseaseSigns),

          diarrhea: normalizeBooleanValue(raw.disease.diarrhea),

          deformedWings: normalizeBooleanValue(raw.disease.deformedWings),

          mitesVisible: normalizeBooleanValue(raw.disease.mitesVisible),

          weakBrood: normalizeBooleanValue(raw.disease.weakBrood),

          updatedAt: raw.disease.updatedAt,
        }
      : undefined,

    swarm: raw.swarm
      ? {
          hasSwarmSigns: normalizeBooleanValue(raw.swarm.hasSwarmSigns),

          queenEmergence: normalizeBooleanValue(raw.swarm.queenEmergence),

          sealedCells: normalizeBooleanValue(raw.swarm.sealedCells),

          openCells: normalizeBooleanValue(raw.swarm.openCells),

          eggsInCells: normalizeBooleanValue(raw.swarm.eggsInCells),

          updatedAt: raw.swarm.updatedAt,
        }
      : undefined,

    split: raw.split
      ? {
          isSplit: normalizeBooleanValue(raw.split.isSplit),

          usedForSplits: normalizeBooleanValue(raw.split.usedForSplits),

          broodFrames: raw.split.broodFrames,

          foodFrames: raw.split.foodFrames,

          totalBroodFrames: raw.split.totalBroodFrames ?? 0,

          totalFoodFrames: raw.split.totalFoodFrames ?? 0,

          updatedAt: raw.split.updatedAt,
        }
      : undefined,

    meta: raw.meta
      ? {
          lastInspectionAt: raw.meta.lastInspectionAt,

          lastFeedingAt: raw.meta.lastFeedingAt,

          lastDiseaseCheckAt: raw.meta.lastDiseaseCheckAt,

          lastSwarmCheckAt: raw.meta.lastSwarmCheckAt,

          lastSplitActionAt: raw.meta.lastSplitActionAt,

          hasFeeding: normalizeBooleanValue(raw.meta.hasFeeding),

          hasDiseaseSigns: normalizeBooleanValue(raw.meta.hasDiseaseSigns),

          hasSwarmSigns: normalizeBooleanValue(raw.meta.hasSwarmSigns),

          isSplit: normalizeBooleanValue(raw.meta.isSplit),

          usedForSplits: normalizeBooleanValue(raw.meta.usedForSplits),

          lastStrength: raw.meta.lastStrength,

          lastBroodFrames: raw.meta.lastBroodFrames,

          totalBroodFrames: raw.meta.totalBroodFrames ?? 0,

          totalFoodFrames: raw.meta.totalFoodFrames ?? 0,

          currentDiseaseType: raw.meta.currentDiseaseType,
        }
      : undefined,
  };
}

export function normalizeHiveContexts(input: unknown[]): HiveContext[] {
  return input.map(normalizeHiveContext);
}
