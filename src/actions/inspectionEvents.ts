export type InspectionEvent =
  | {
      type: 'STOP_INSPECTION';
      hiveNumber: number;
      context?: {
        source?: 'voice' | 'manual';
      };
    }
  | {
      type: 'UPDATE_INSPECTION';
      hiveNumber: number;
      payload: {
        strength?: number | null;
        honeyKg?: number | null;
        broodFrames?: number | null;
        queen?: 'present' | 'absent' | 'unknown' | null;
        syrupLiters?: number | null;
      };
      context?: {
        source?: 'voice' | 'manual';
      };
    };
