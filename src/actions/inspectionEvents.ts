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
        queen?: 'present' | 'absent' | 'unknown' | null;
      };
    };
