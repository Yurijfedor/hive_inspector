import type {QueenStatus, QueenBreed} from '../../types/queen';

export type InspectionFormData = {
  strength?: number;

  broodFrames?: number;

  queen?: QueenStatus;

  queenBreed?: QueenBreed;

  queenYear?: number;

  honeyKg?: number;
};

export type InspectionFormUI = {
  // -------------------
  // inspection
  // -------------------

  inspection?: {
    strength?: number;

    broodFrames?: number;

    honeyKg?: number;

    queen: QueenStatus;

    queenBreed?: QueenBreed;

    queenYear?: number;
  };

  // -------------------
  // swarm
  // -------------------

  swarm?: {
    queenEmergence: boolean;

    sealedCells: boolean;

    openCells: boolean;

    eggsInCells: boolean;
  };

  // -------------------
  // disease
  // -------------------

  disease?: {
    diarrhea: boolean;

    deformedWings: boolean;

    mitesVisible: boolean;

    weakBrood: boolean;
  };

  // -------------------
  // split
  // -------------------

  split?: {
    isSplit: boolean;

    usedForSplits: boolean;

    broodFrames?: number;

    foodFrames?: number;
  };
};

export type InspectionFormNormalized = {
  inspection?: {
    strength: number;
    broodFrames: number;
    honeyKg: number;

    queen: QueenStatus;

    queenBreed?: QueenBreed;

    queenYear: number;
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

export type ManualInspectionFormState = {
  inspection: {
    strength: string;

    broodFrames: string;

    honeyKg: string;

    queen: boolean;

    queenBreed?: QueenBreed;

    queenYear?: string;
  };

  swarm: {
    queenEmergence: boolean;

    sealedCells: boolean;

    openCells: boolean;

    eggsInCells: boolean;
  };

  disease: {
    diarrhea: boolean;

    deformedWings: boolean;

    mitesVisible: boolean;

    weakBrood: boolean;
  };

  split: {
    isSplit: boolean;

    usedForSplits: boolean;

    broodFrames: string;

    foodFrames: string;
  };
};
