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
    .replace(/[’ʼ'`´]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
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

// 🔹 scoring для Intent Detector-ів
export function scoreIntent(tokens: string[], vocabulary: string[]): number {
  let score = 0;

  for (const token of tokens) {
    if (token.length < 3) {
      continue;
    }

    for (const word of vocabulary) {
      // exact / includes
      if (token.includes(word)) {
        score += 2;
        continue;
      }

      // fuzzy
      if (similarity(token, word) > 0.7) {
        score += 1.5;
      }
    }
  }

  return score;
}
