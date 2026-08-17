import type {Queen} from './queen';

import type {DiseaseType} from './disease';

export type Hive = {
  hiveNumber: number;
  createdAt: number;
};

export type HiveInspectionSummary = {
  date: number;

  strength: number;

  honeyKg: number;

  broodFrames?: number;

  queenStatus?: Queen['status'];
};

export type HiveFeedingState = {
  hasFeeding: boolean;

  syrupLiters?: number;

  lastFeedingAt?: number;
};

export type HiveDiseaseState = {
  disease?: DiseaseType;

  hasDiseaseSigns: boolean;

  diarrhea: boolean;

  deformedWings: boolean;

  mitesVisible: boolean;

  weakBrood: boolean;

  updatedAt?: number;
};

export type HiveSwarmState = {
  hasSwarmSigns: boolean;

  queenEmergence: boolean;

  sealedCells: boolean;

  openCells: boolean;

  eggsInCells: boolean;

  updatedAt?: number;
};

export type HiveSplitState = {
  isSplit: boolean;

  usedForSplits: boolean;

  broodFrames?: number;

  foodFrames?: number;

  totalBroodFrames: number;

  totalFoodFrames: number;

  updatedAt?: number;
};

export type HiveMeta = {
  // -------------------------
  // timestamps
  // -------------------------
  lastInspectionAt?: number;

  lastFeedingAt?: number;

  lastDiseaseCheckAt?: number;

  lastSwarmCheckAt?: number;

  lastSplitActionAt?: number;

  // -------------------------
  // quick dashboard flags
  // -------------------------
  hasFeeding: boolean;

  hasDiseaseSigns: boolean;

  hasSwarmSigns: boolean;

  isSplit: boolean;

  usedForSplits: boolean;

  // -------------------------
  // quick metrics
  // -------------------------
  lastStrength?: number;

  lastBroodFrames?: number;

  totalBroodFrames: number;

  totalFoodFrames: number;

  currentDiseaseType?: DiseaseType;
};

export type HiveContext = {
  hiveNumber: number;

  queen?: Queen;

  lastInspection?: HiveInspectionSummary;

  feeding?: HiveFeedingState;

  disease?: HiveDiseaseState;

  swarm?: HiveSwarmState;

  split?: HiveSplitState;

  meta?: HiveMeta;
};
