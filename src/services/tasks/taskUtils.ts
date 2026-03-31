import {Task} from '../../types/task';

export const sortTasks = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => a.date - b.date);
};

export const getDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();

  const diff =
    new Date(date.toDateString()).getTime() -
    new Date(today.toDateString()).getTime();

  const oneDay = 1000 * 60 * 60 * 24;

  if (diff === 0) return 'Сьогодні';
  if (diff === oneDay) return 'Завтра';

  return date.toLocaleDateString();
};

export const groupTasksByDate = (tasks: Task[]) => {
  const groups: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    const key = new Date(task.date).toDateString();

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(task);
  });

  return groups;
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const groupTasksByType = (tasks: Task[]) => {
  const result: Record<string, Task[]> = {};

  tasks.forEach((task) => {
    if (!result[task.type]) {
      result[task.type] = [];
    }

    result[task.type].push(task);
  });

  return result;
};
