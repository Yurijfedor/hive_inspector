export type InspectionCommand = {
  hiveNumber: number;
  strength?: number | null;
  honeyKg?: number | null;
  queen?: 'present' | 'absent' | 'unknown' | null;
  stop?: boolean;
};

export type SwarmCommand = {
  hiveNumber: number;
  hasSwarmSigns?: boolean | null;
  hasQueenCells?: boolean | null;
  queenCellsCount?: number | null;
};
