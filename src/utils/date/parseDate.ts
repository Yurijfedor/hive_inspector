export const parseDateUA = (value: string): number | null => {
  const parts = value.split('-');

  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(Number);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return null;

  return date.getTime();
};
