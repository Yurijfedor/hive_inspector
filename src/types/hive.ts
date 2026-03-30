export type HiveContext = {
  hiveNumber: number;

  lastInspection: {
    date: number;
    strength: number;
    honeyKg: number;
    hasQueen: boolean;
  } | null;

  // 🟡 FEEDING
  feeding?: {
    hasFeeding: boolean;
    syrupLiters?: number;
    lastFeedingAt?: number;
  };

  // 🔴 SWARM
  swarm?: {
    hasSwarmSigns: boolean;
    queenEmergence?: boolean;
    lastSwarmCheck?: number;
  };

  // 🟣 DISEASE (FIX 🔥)
  disease?: {
    hasDiseaseSigns: boolean;
    lastDiseaseCheck?: number;
  };

  // 🔵 SPLIT (НОВЕ 🔥)
  split?: {
    isSplit: boolean;
    usedForSplits: boolean;
    totalBroodFrames?: number;
    totalFoodFrames?: number;
    lastSplitActionAt?: number;
  };

  // ⚫ META (розширюємо трохи)
  meta?: {
    lastInspectionAt?: number;
    lastFeedingAt?: number;
    lastDiseaseCheckAt?: number;
    lastSplitActionAt?: number;

    hasFeeding?: boolean;
    hasDiseaseSigns?: boolean;
    hasSwarmSigns?: boolean;

    lastStrength?: number;
  };
};
