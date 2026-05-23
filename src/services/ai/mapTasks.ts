import {Task} from '../../types/task';

import {
  TASK_SOURCES,
  TASK_PRIORITIES,
  TASK_TYPES,
} from '../../domain/constants/task';

type RawLLMTask = {
  hiveNumber?: number | string;

  title?: string;

  type?: string;

  inDays?: number | string;
};

type LLMResponse =
  | {
      tasks: RawLLMTask[];
    }
  | {
      primaryTask?: RawLLMTask;

      secondaryTasks?: RawLLMTask[];
    };

// -------------------------
// allowed task types
// -------------------------

const ALLOWED_TYPES = [
  TASK_TYPES.FEEDING,
  TASK_TYPES.INSPECTION,
  TASK_TYPES.DISEASE,
  TASK_TYPES.SWARM,
  TASK_TYPES.SPLIT,
] as const;

// -------------------------
// normalize task type
// -------------------------

function normalizeTaskType(value: unknown): Task['type'] {
  if (typeof value !== 'string') {
    return TASK_TYPES.OTHER;
  }

  const normalized = value.toLowerCase();

  const match = ALLOWED_TYPES.find((type) => type === normalized);

  return match ?? TASK_TYPES.OTHER;
}

export const mapLLMTasksToDomain = (data: LLMResponse): Task[] => {
  const result: Task[] = [];

  const normalizeTask = (
    task: RawLLMTask,
    priority?: Task['priority'],
  ): Task | null => {
    const hiveNumber = Number(task.hiveNumber);

    if (Number.isNaN(hiveNumber)) {
      return null;
    }

    const inDaysRaw = Number(task.inDays);

    const inDays = Math.max(0, Math.min(30, inDaysRaw || 0));

    const DAY = 1000 * 60 * 60 * 24;

    const nowTs = Date.now();

    return {
      id: `${nowTs}-${Math.random()}`,

      hiveNumber,

      title: String(task.title || 'Untitled Task'),

      type: normalizeTaskType(task.type),

      date: nowTs + inDays * DAY,

      source: TASK_SOURCES.AI,

      completed: false,

      priority,

      updatedAt: nowTs,
    };
  };

  // -------------------------
  // priority-based format
  // -------------------------

  if ('primaryTask' in data || 'secondaryTasks' in data) {
    if (data.primaryTask) {
      const task = normalizeTask(data.primaryTask, TASK_PRIORITIES.PRIMARY);

      if (task) {
        result.push(task);
      }
    }

    if (Array.isArray(data.secondaryTasks)) {
      for (const t of data.secondaryTasks) {
        const task = normalizeTask(t, TASK_PRIORITIES.SECONDARY);

        if (task) {
          result.push(task);
        }
      }
    }
  }

  // -------------------------
  // legacy array format
  // -------------------------
  else if ('tasks' in data && Array.isArray(data.tasks)) {
    for (const t of data.tasks) {
      const task = normalizeTask(t, TASK_PRIORITIES.PRIMARY);

      if (task) {
        result.push(task);
      }
    }
  }

  return result;
};
