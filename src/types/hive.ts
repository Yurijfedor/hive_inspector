export type HiveQueen = {
  status?: 'present' | 'absent';
  breed?: string;
  birthYear?: number;
};

export type HiveContext = {
  hiveNumber: number;

  queen?: HiveQueen;

  lastInspection: {
    date: number;
    strength: number;
    honeyKg: number;
    broodFrames?: number;
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
    hasSwarmSigns: boolean | 'так' | 'ні';
    queenEmergence?: boolean;
    lastSwarmCheck?: number;
  };

  // 🟣 DISEASE
  disease?: {
    hasDiseaseSigns: boolean | 'так' | 'ні';
    lastDiseaseCheck?: number;
  };

  // 🔵 SPLIT
  split?: {
    isSplit: boolean;
    usedForSplits: boolean;
    totalBroodFrames?: number;
    totalFoodFrames?: number;
    lastSplitActionAt?: number;
  };

  // ⚫ META
  meta?: {
    lastInspectionAt?: number;
    lastFeedingAt?: number;
    lastDiseaseCheckAt?: number;
    lastSplitActionAt?: number;

    hasFeeding?: boolean;
    hasDiseaseSigns?: boolean;
    hasSwarmSigns?: boolean;
    lastBroodFrames?: number;
    lastStrength?: number;
  };
};
