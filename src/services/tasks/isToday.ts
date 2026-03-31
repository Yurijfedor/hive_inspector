export const isToday = (timestamp: number) => {
  const today = new Date();
  const date = new Date(timestamp);

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
