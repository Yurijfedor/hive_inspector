import {parseNumber} from './numberParser';

const TENS: Record<string, number> = {
  двадцять: 20,
  тридцять: 30,
  сорок: 40,
  "п'ятдесят": 50,
  шістдесят: 60,
  сімдесят: 70,
  вісімдесят: 80,
  "дев'яносто": 90,
};

export function parseHiveNumber(text: string): number | null {
  if (!text) return null;

  const words = text.toLowerCase().replace(/[’ʼ]/g, "'").split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const w = words[i];

    // 1️⃣ десятки
    if (TENS[w] !== undefined) {
      const tens = TENS[w];

      const next = words[i + 1];
      const unit = next ? parseNumber(next) : null;

      if (unit !== null) {
        return tens + unit;
      }

      return tens;
    }

    // 2️⃣ прості числа
    const single = parseNumber(w);
    if (single !== null) {
      return single;
    }

    // 3️⃣ цифри
    const numeric = Number(w);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
  }

  return null;
}
