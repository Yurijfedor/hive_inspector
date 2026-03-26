import {TaskEvent} from '../events/taskEvents';
import {TaskRepository} from '../repositories/taskRepository';
import {Task} from '../../types/task';

const taskRepository = new TaskRepository();

export type TaskEffectResult =
  | {kind: 'TASKS_UPDATED'; tasks: Task[]}
  | {kind: 'TASK_COMPLETED'; taskId: string};

export async function handleTaskEffect(
  uid: string,
  event: TaskEvent,
): Promise<TaskEffectResult> {
  switch (event.type) {
    case 'TASKS_CREATED_FROM_AI': {
      const merged = await taskRepository.mergeFromAI(uid, event.payload.tasks);

      return {
        kind: 'TASKS_UPDATED',
        tasks: merged,
      };
    }

    case 'TASK_COMPLETED': {
      await taskRepository.completeTask(uid, event.payload.taskId);

      return {
        kind: 'TASK_COMPLETED',
        taskId: event.payload.taskId,
      };
    }
  }
}
