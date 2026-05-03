export type Inspection = {
  id: string;
  hiveNumber: number;

  date: number; // createdAt
  strength: number; // 0–10 (або як у тебе)
  honeyKg: number;
  broodFrames?: number;
  queen: 'present' | 'absent' | 'unknown' | 'так' | 'ні';
  source: 'voice' | 'manual' | 'ai';
};

export type InspectionRaw = {
  createdAt?: number;
  strength?: number;
  honeyKg?: number;
  broodFrames?: number;
  queen?: 'present' | 'absent' | 'unknown' | 'так' | 'ні';
  source: 'voice' | 'manual' | 'ai';
};
