import {Task} from '../../types/task';
import {TasksViewModel} from '../../domain/viewModels/tasksViewModel';
import {isToday} from './isToday';

export const mapTasksToViewModel = (tasks: Task[]): TasksViewModel => {
  const today: Record<string, Task[]> = {};
  const upcomingMap: Record<string, Task[]> = {};

  let totalToday = 0;
  const byType: Record<string, number> = {};

  tasks.forEach((task) => {
    if (task.completed) return;

    const taskDate =
      typeof task.date === 'string' ? new Date(task.date).getTime() : task.date;

    if (isToday(taskDate)) {
      if (!today[task.type]) {
        today[task.type] = [];
      }

      today[task.type].push(task);

      totalToday++;

      if (!byType[task.type]) {
        byType[task.type] = 0;
      }

      byType[task.type]++;
    } else {
      const dateKey = new Date(taskDate).toDateString();

      if (!upcomingMap[dateKey]) {
        upcomingMap[dateKey] = [];
      }

      upcomingMap[dateKey].push(task);
    }
  });

  // 👉 convert upcoming map → array
  const upcoming = Object.entries(upcomingMap)
    .map(([date, groupTasks]) => ({
      date: new Date(date).getTime(),
      tasks: groupTasks,
    }))
    .sort((a, b) => a.date - b.date);

  return {
    today,
    upcoming,
    stats: {
      totalToday,
      byType,
    },
  };
};
