export type InspectionCommand = {
  hiveNumber: number;
  strength?: number | null;
  honeyKg?: number | null;
  queen?: 'present' | 'absent' | 'unknown' | null;
  stop?: boolean;
};
