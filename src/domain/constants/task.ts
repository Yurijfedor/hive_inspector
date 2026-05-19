export const TASK_TYPES = {
  FEEDING: 'feeding',
  INSPECTION: 'inspection',
  DISEASE: 'disease',
  SWARM: 'swarm',
  SPLIT: 'split',
  OTHER: 'other',
} as const;

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];

export const TASK_PRIORITIES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type TaskPriority =
  (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export const TASK_SOURCES = {
  USER: 'user',
  SYSTEM: 'system',
  CLOUD: 'cloud',
  LOCAL: 'local',
  AI: 'ai',
} as const;

export type TaskSource = (typeof TASK_SOURCES)[keyof typeof TASK_SOURCES];
