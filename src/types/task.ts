export type Task = {
  id: string;
  hiveNumber: number;
  title: string;

  type: 'FEEDING' | 'INSPECTION' | 'DISEASE' | 'SWARM' | 'SPLIT' | 'OTHER';
  date: number;

  completed: boolean;

  source: 'LLM' | 'USER' | 'SYSTEM' | 'CLOUD';

  priority?: 'PRIMARY' | 'SECONDARY';

  note?: string; // 🔥 нове поле

  updatedAt: number;

  deleted?: boolean;
};
