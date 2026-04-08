export type Inspection = {
  id: string;
  hiveNumber: number;

  date: number; // createdAt
  strength: number; // 0–10 (або як у тебе)
  honeyKg: number;

  queen: 'present' | 'absent' | 'unknown';
};

export type InspectionRaw = {
  createdAt?: number;
  strength?: number;
  honeyKg?: number;
  queen?: 'present' | 'absent';
};
