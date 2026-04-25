import {BaseEvent} from './baseEvent';

import {Task} from '../../types/task';

export type TaskEvent =
  | ({
      type: 'TASKS_CREATED_FROM_AI';
      payload: {
        tasks: Task[];
      };
    } & BaseEvent)
  | ({
      type: 'TASK_COMPLETED';
      payload: {
        taskId: string;
      };
    } & BaseEvent);
