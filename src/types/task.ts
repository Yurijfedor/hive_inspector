export type Task = {
  id: string;
  hiveNumber: number;
  title: string;

  type:
    | 'FEEDING'
    | 'INSPECTION'
    | 'DISEASE' // 🔥 було TREATMENT
    | 'SWARM' // 🔥 нове
    | 'SPLIT' // 🔥 нове
    | 'OTHER';
  date: number; // 🔥 було string → стало timestamp

  completed: boolean;

  source: 'LLM' | 'USER' | 'SYSTEM' | 'CLOUD';

  priority?: 'PRIMARY' | 'SECONDARY';

  note?: string; // 🔥 нове поле

  updatedAt: number;
};
