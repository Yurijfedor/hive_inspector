import {Task} from '../../types/task';

export type EventType =
  | 'FEEDING'
  | 'INSPECTION'
  | 'DISEASE'
  | 'SWARM'
  | 'SPLIT';

const taskTypeToEvent: Record<string, EventType> = {
  FEEDING: 'FEEDING',
  INSPECTION: 'INSPECTION',
  DISEASE: 'DISEASE',
  SWARM: 'SWARM',
  SPLIT: 'SPLIT',
};

export const autoCompleteTasks = (
  tasks: Task[],
  hiveNumber: number,
  eventType: EventType,
): Task[] => {
  const now = Date.now();

  return tasks.map((task) => {
    if (task.hiveNumber !== hiveNumber) return task;
    if (task.completed) return task;

    const expectedEvent = taskTypeToEvent[task.type];

    if (expectedEvent !== eventType) return task;

    console.log('✅ AUTO COMPLETE:', task.title);

    return {
      ...task,
      completed: true,
      updatedAt: now,
      source: 'SYSTEM',
    };
  });
};
