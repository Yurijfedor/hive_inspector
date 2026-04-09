export type InspectionEvent =
  | {
      type: 'STOP_INSPECTION';
      hiveNumber: number;
    }
  | {
      type: 'UPDATE_INSPECTION';
      hiveNumber: number;
      payload: {
        strength?: number | null;
        honeyKg?: number | null;
        broodFrames?: number;
        queen?: 'present' | 'absent' | 'unknown' | null;
        syrupLiters?: number | null;
      };
    };
