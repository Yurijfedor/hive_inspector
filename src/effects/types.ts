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
