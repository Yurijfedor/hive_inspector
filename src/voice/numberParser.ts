// 🔹 reuse той самий normalize (розширимо трохи)
function normalizeWord(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’ʼ']/g, '') // всі апострофи прибираємо
    .replace(/[^а-яіїєґ0-9\s]/g, ' ') // шум
    .replace(/\s+/g, ' ')
    .trim();
}

// 🔹 lightweight fuzzy
function similarity(a: string, b: string): number {
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

// 🔹 fuzzy lookup
function fuzzyNumber(word: string): number | null {
  let bestScore = 0;
  let bestValue: number | null = null;

  for (const key of Object.keys(NUMBER_WORDS)) {
    const score = similarity(word, key.replace(/'/g, ''));

    if (score > bestScore) {
      bestScore = score;
      bestValue = NUMBER_WORDS[key];
    }
  }

  return bestScore > 0.65 ? bestValue : null;
}

const NUMBER_WORDS: Record<string, number> = {
  нуля: 0,

  один: 1,
  одна: 1,

  два: 2,
  дві: 2,

  три: 3,
  чотири: 4,

  пять: 5,
  шість: 6,
  сім: 7,
  вісім: 8,

  девять: 9,
  десять: 10,

  одинадцять: 11,
  дванадцять: 12,
  тринадцять: 13,
  чотирнадцять: 14,

  пятнадцять: 15,
  шістнадцять: 16,
  сімнадцять: 17,
  вісімнадцять: 18,

  девятнадцять: 19,
  двадцять: 20,
};

export function parseNumber(input: string): number | null {
  if (!input) return null;

  const text = normalizeWord(input);

  // 🔹 1. якщо чисте число
  const numeric = Number(text);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  const tokens = text.split(' ');

  // 🔥 2. token-based parsing (ВАЖЛИВО)
  let total = 0;
  let found = false;

  for (const token of tokens) {
    // exact
    if (NUMBER_WORDS[token] !== undefined) {
      total += NUMBER_WORDS[token];
      found = true;
      continue;
    }

    // fuzzy
    const fuzzy = fuzzyNumber(token);
    if (fuzzy !== null) {
      total += fuzzy;
      found = true;
    }
  }

  if (found) return total;

  return null;
}
