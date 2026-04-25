export type InspectionFormData = {
  strength?: number;
  broodFrames?: number;

  queen?: 'так' | 'ні';
  queenBreed?: string;
  queenYear?: number;

  honeyKg: number;
};

export type InspectionFormUI = {
  // -------------------
  // inspection
  // -------------------
  inspection?: {
    strength: number;
    broodFrames: number;
    honeyKg: number;
    queen: string;
    queenBreed?: string;
    queenYear?: number;
  };

  swarm?: {
    queenEmergence: boolean;
    sealedCells: boolean;
    openCells: boolean;
    eggsInCells: boolean;
  };

  disease?: {
    diarrhea: boolean;
    deformedWings: boolean;
    mitesVisible: boolean;
    weakBrood: boolean;
  };

  split?: {
    isSplit: boolean;
    usedForSplits: boolean;
    broodFrames: number;
    foodFrames: number;
  };
};
