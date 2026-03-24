export const mapLLMTasksToDomain = (llmTasks: any[]) => {
  const now = Date.now();

  const allowedTypes = ['FEEDING', 'INSPECTION', 'TREATMENT'];

  return (
    llmTasks
      .map((t) => {
        // 🛑 1. Безпечний hiveNumber
        const hiveNumber = Number(t.hiveNumber);

        // якщо не число → пропускаємо
        if (isNaN(hiveNumber)) {
          return null;
        }

        // 🛑 2. Контроль днів (0–30)
        const inDaysRaw = Number(t.inDays);
        const inDays = Math.max(0, Math.min(30, inDaysRaw || 0));

        // 🛑 3. Контроль типу
        const type = allowedTypes.includes(t.type) ? t.type : 'OTHER';

        // 🛑 4. Безпечний title
        const title = String(t.title || 'Без назви');

        return {
          id: `${Date.now()}-${Math.random()}`,
          hiveNumber,
          title,
          type,
          date: new Date(now + inDays * 86400000).toISOString(),
          source: 'LLM',
          completed: false,
        };
      })
      // 🛑 5. прибираємо null
      .filter(Boolean)
  );
};
