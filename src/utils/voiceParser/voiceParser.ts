// 🔹 дуже легкий fuzzy (без залежностей)
export function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;

  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;

  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }

  return matches / longer.length;
}

// 🔹 normalize (ключ до всього пайплайну)
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ʼ']/g, '') // апострофи
    .replace(/[^а-яіїєґ0-9\s]/g, ' ') // шум
    .replace(/\s+/g, ' ')
    .trim();
}

// 🔹 fuzzy lookup
export function fuzzyLookup(
  word: string,
  map: Record<string, number>,
): number | null {
  if (map[word] !== undefined) return map[word];

  let bestScore = 0;
  let bestValue: number | null = null;

  for (const key of Object.keys(map)) {
    const score = similarity(word, key);

    if (score > bestScore) {
      bestScore = score;
      bestValue = map[key];
    }
  }

  // 🔥 поріг — підібраний під nano
  return bestScore > 0.6 ? bestValue : null;
}
