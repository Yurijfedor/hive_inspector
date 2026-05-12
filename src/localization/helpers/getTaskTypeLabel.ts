import {TFunction} from 'i18next';

import {TaskType} from '../../types/task';

export function getTaskTypeLabel(type: TaskType, t: TFunction) {
  return t(`taskTypes:${type}`);
}
