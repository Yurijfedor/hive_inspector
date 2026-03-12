function normalizeWord(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’ʼ]/g, "'") // нормалізація апострофів
    .trim();
}

const NUMBER_WORDS: Record<string, number> = {
  нуль: 0,

  один: 1,
  одна: 1,

  два: 2,
  дві: 2,

  три: 3,
  чотири: 4,

  "п'ять": 5,
  шість: 6,
  сім: 7,
  вісім: 8,

  "дев'ять": 9,
  десять: 10,

  одинадцять: 11,
  дванадцять: 12,
  тринадцять: 13,
  чотирнадцять: 14,

  "п'ятнадцять": 15,
  шістнадцять: 16,
  сімнадцять: 17,
  вісімнадцять: 18,

  "дев'ятнадцять": 19,
  двадцять: 20,
};

export function parseNumber(input: string): number | null {
  if (!input) return null;

  const text = normalizeWord(input);

  // якщо це вже число
  const numeric = Number(text);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  // якщо це слово
  if (NUMBER_WORDS[text] !== undefined) {
    return NUMBER_WORDS[text];
  }

  return null;
}
