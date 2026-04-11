import {parseNumber} from './numberParser';

// 🔹 normalize (узгоджено з іншими)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’ʼ']/g, '')
    .replace(/[^а-яіїєґ0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 🔹 similarity (той самий)
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

// 🔹 fuzzy lookup для десятків
function fuzzyTens(word: string): number | null {
  let bestScore = 0;
  let bestValue: number | null = null;

  for (const key of Object.keys(TENS)) {
    const score = similarity(word, key.replace(/'/g, ''));

    if (score > bestScore) {
      bestScore = score;
      bestValue = TENS[key];
    }
  }

  return bestScore > 0.65 ? bestValue : null;
}

const TENS: Record<string, number> = {
  двадцять: 20,
  тридцять: 30,
  сорок: 40,
  пятдесят: 50,
  шістдесят: 60,
  сімдесят: 70,
  вісімдесят: 80,
  девяносто: 90,
};

export function parseHiveNumber(input: string): number | null {
  if (!input) return null;

  const text = normalizeText(input);
  const tokens = text.split(' ');

  // 🔥 1. спочатку шукаємо "кластер числа"
  // (два сусідніх токени, які виглядають як число)
  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];

    // 🔹 десятки (exact або fuzzy)
    let tens = TENS[current] ?? fuzzyTens(current);

    if (tens !== null && tens !== undefined) {
      const unit = next ? parseNumber(next) : null;

      if (unit !== null) {
        return tens + unit;
      }

      return tens;
    }

    // 🔹 одиничне число (але не перше сміття)
    const single = parseNumber(current);
    if (single !== null) {
      return single;
    }

    // 🔹 цифри
    const numeric = Number(current);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
  }

  return null;
}
