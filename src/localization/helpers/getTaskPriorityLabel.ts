import {TFunction} from 'i18next';

import {TaskPriority} from '../../types/task';

export function getTaskPriorityLabel(priority: TaskPriority, t: TFunction) {
  return t(`taskPriorities:${priority}`);
}
