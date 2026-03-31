export const getRelativeDateLabel = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // 🔥 залишаємо тільки для близьких
  if (diffDays === 0) return 'Сьогодні';
  if (diffDays === 1) return 'Завтра';

  // 👉 формат дати
  const day = String(target.getDate()).padStart(2, '0');
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const year = target.getFullYear();

  return `${day}.${month}.${year}`;
};
