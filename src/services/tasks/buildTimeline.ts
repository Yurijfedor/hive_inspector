import {Task} from '../../types/task';

type TimelineDay = {
  date: number;
  tasks: Task[];
};

export const buildTimeline = (
  tasks: Task[],
  days: number = 5,
): TimelineDay[] => {
  const result: TimelineDay[] = [];

  const now = new Date();

  for (let i = 1; i <= days; i++) {
    const day = new Date();
    day.setDate(now.getDate() + i);

    const start = new Date(day.setHours(0, 0, 0, 0)).getTime();
    const end = new Date(day.setHours(23, 59, 59, 999)).getTime();

    const dayTasks = tasks.filter((task) => {
      if (task.completed) return false;

      const taskDate =
        typeof task.date === 'string'
          ? new Date(task.date).getTime()
          : task.date;

      return taskDate >= start && taskDate <= end;
    });

    result.push({
      date: start,
      tasks: dayTasks,
    });
  }

  return result;
};
