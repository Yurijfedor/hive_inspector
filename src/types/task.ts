export type Task = {
  id: string;
  hiveNumber: number;
  title: string;
  type: 'FEEDING' | 'INSPECTION' | 'TREATMENT' | 'OTHER';
  date: string;

  source: 'LLM';
  completed: boolean;

  priority?: 'PRIMARY' | 'SECONDARY';
};
