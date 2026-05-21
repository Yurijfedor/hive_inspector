import {TASK_PRIORITIES, TASK_SOURCES, TASK_TYPES} from '../constants/task';

import {normalizeText} from './textNormalizer';

export function normalizeTaskType(input: unknown) {
  const text = normalizeText(input);

  switch (text) {
    case 'feeding':
      return TASK_TYPES.FEEDING;

    case 'inspection':
      return TASK_TYPES.INSPECTION;

    case 'disease':
      return TASK_TYPES.DISEASE;

    case 'swarm':
      return TASK_TYPES.SWARM;

    case 'split':
      return TASK_TYPES.SPLIT;

    default:
      return TASK_TYPES.OTHER;
  }
}

export function normalizeTaskPriority(input: unknown) {
  const text = normalizeText(input);

  switch (text) {
    case 'primary':
      return TASK_PRIORITIES.PRIMARY;

    default:
      return TASK_PRIORITIES.SECONDARY;
  }
}

export function normalizeTaskSource(input: unknown) {
  const text = normalizeText(input);

  switch (text) {
    case 'user':
      return TASK_SOURCES.USER;

    case 'system':
      return TASK_SOURCES.SYSTEM;

    case 'cloud':
      return TASK_SOURCES.CLOUD;

    case 'ai':
      return TASK_SOURCES.AI;

    default:
      return TASK_SOURCES.LOCAL;
  }
}
