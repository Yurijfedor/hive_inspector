export type Task = {
  id: string;
  hiveNumber: number;
  title: string;

  type: 'FEEDING' | 'INSPECTION' | 'TREATMENT' | 'OTHER';

  date: string;

  completed: boolean;

  // 🔥 джерело задачі (розширимо)
  source: 'LLM' | 'USER' | 'SYSTEM' | 'CLOUD';

  // 🔥 пріоритет
  priority?: 'PRIMARY' | 'SECONDARY';

  // 🔥 КРИТИЧНО для sync
  updatedAt: number; // timestamp (Date.now())
};
