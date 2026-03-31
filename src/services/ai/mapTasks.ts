import {Task} from '../../types/task';

type LLMResponse =
  | {tasks: any[]}
  | {
      primaryTask?: any;
      secondaryTasks?: any[];
    };

export const mapLLMTasksToDomain = (data: LLMResponse): Task[] => {
  // const now = Date.now();

  const allowedTypes = ['FEEDING', 'INSPECTION', 'DISEASE', 'SWARM', 'SPLIT'];

  const result: Task[] = [];

  const normalizeTask = (
    t: any,
    priority?: 'PRIMARY' | 'SECONDARY',
  ): Task | null => {
    const hiveNumber = Number(t.hiveNumber);
    if (isNaN(hiveNumber)) return null;

    const inDaysRaw = Number(t.inDays);
    const inDays = Math.max(0, Math.min(30, inDaysRaw || 0));

    const type = allowedTypes.includes(t.type) ? t.type : 'OTHER';

    const title = String(t.title || 'Без назви');

    const DAY = 1000 * 60 * 60 * 24;

    const nowTs = Date.now(); // 🔥 єдина точка часу

    return {
      id: `${nowTs}-${Math.random()}`,
      hiveNumber,
      title,
      type,
      date: Date.now() + inDays * DAY, // 🔥 дата з урахуванням inDays
      source: 'LLM',
      completed: false,
      priority,
      updatedAt: nowTs,
    };
  };

  // 🔹 1. Новий формат (priority-based)
  if ('primaryTask' in data || 'secondaryTasks' in data) {
    if (data.primaryTask) {
      const task = normalizeTask(data.primaryTask, 'PRIMARY');
      if (task) result.push(task);
    }

    if (Array.isArray(data.secondaryTasks)) {
      for (const t of data.secondaryTasks) {
        const task = normalizeTask(t, 'SECONDARY');
        if (task) result.push(task);
      }
    }
  }

  // 🔹 2. Старий формат (масив)
  else if ('tasks' in data && Array.isArray(data.tasks)) {
    for (const t of data.tasks) {
      const task = normalizeTask(t, 'PRIMARY'); // 👉 всі як primary
      if (task) result.push(task);
    }
  }

  return result;
};
