export type Inspection = {
  id: string;
  hiveNumber: number;

  date: number; // createdAt
  strength: number; // 0–10 (або як у тебе)
  honeyKg: number;

  hasQueen: boolean;
};
