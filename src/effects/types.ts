export type InspectionEffectResult =
  | {
      kind: 'UPDATED';
      hiveNumber: number;
      payload: {
        strength: number | null;
        honeyKg: number | null;
        queen: 'present' | 'absent' | 'unknown' | null;
        syrupLiters: number | null;
      };
    }
  | {
      kind: 'STOPPED';
      hiveNumber: number;
    };

export type SwarmEffectResult = {
  kind: 'RECORDED';
  hiveNumber: number;
  payload: {
    hasSwarmSigns: boolean | null;
    hasQueenCells: boolean | null;
    queenCellsCount: number | null;
  };
};
