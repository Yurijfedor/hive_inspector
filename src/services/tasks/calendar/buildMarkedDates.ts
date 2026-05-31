import {Task} from '../../../types/task';

type MarkedDates = Record<
  string,
  {
    marked?: boolean;
    selected?: boolean;
    dotColor?: string;
    selectedColor?: string;
  }
>;

export const buildMarkedDates = (
  tasks: Task[],
  selectedDate?: string | null,
): MarkedDates => {
  const result: MarkedDates = {};

  tasks.forEach((task) => {
    if (task.completed) {
      return;
    }

    const date = new Date(task.date);

    const key = date.toISOString().split('T')[0];

    result[key] = {
      marked: true,
      dotColor: '#4CAF50',
    };
  });

  if (selectedDate) {
    result[selectedDate] = {
      ...result[selectedDate],
      selected: true,
      selectedColor: '#1976D2',
    };
  }

  return result;
};
