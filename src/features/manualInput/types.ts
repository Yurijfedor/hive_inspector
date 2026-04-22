export type InspectionFormData = {
  strength: number;
  broodFrames: number;

  queen: 'так' | 'ні';
  queenBreed?: string;
  queenYear?: number;

  honeyKg: number;
};

export type InspectionFormUI = {
  strength: number;
  broodFrames: number;

  queen: string; //
  queenBreed?: string;
  queenYear?: number;

  honeyKg: number;
};
