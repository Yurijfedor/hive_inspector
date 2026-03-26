import {Task} from '../../types/task';

function isRecent(date: string, days = 3): boolean {
  const now = Date.now();
  const taskTime = new Date(date).getTime();

  return now - taskTime < days * 24 * 60 * 60 * 1000;
}

function key(task: Task) {
  return `${task.hiveNumber}_${task.type}`;
}

export function mergeTasks(existing: Task[], incoming: Task[]): Task[] {
  const result = [...existing];

  for (const newTask of incoming) {
    const index = result.findIndex((t) => key(t) === key(newTask));

    if (index === -1) {
      result.push(newTask);
      continue;
    }

    const oldTask = result[index];

    if (oldTask.completed) continue;

    if (isRecent(oldTask.date, 3)) continue;

    result[index] = newTask;
  }

  return result;
}
