import {
  normalizeText,
  similarity,
  fuzzyLookup,
} from '../utils/voiceParser/voiceParser';

export function parseYear(input: unknown): number | null {
  if (!input) return null;

  const raw = String(input);
  const text = normalizeText(raw);

  // 🔢 пряме число (але тільки якщо адекватне)
  const direct = Number(text);
  if (!isNaN(direct) && direct > 1900 && direct < 2100) {
    return direct;
  }

  const map: Record<string, number> = {
    нуль: 0,
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
    тридцять: 30,
  };

  // 🔹 токени (ВАЖЛИВО для ASR)
  const tokens = text.split(' ');

  // 👉 fuzzy detection "тисяч"
  const hasThousands = tokens.some((t) => similarity(t, 'тисяч') > 0.6);

  if (!hasThousands) return null;

  let year = 2000;

  // беремо все після "тисяч"
  const index = tokens.findIndex((t) => similarity(t, 'тисяч') > 0.6);
  const rest = tokens.slice(index + 1);

  for (const word of rest) {
    const value = fuzzyLookup(word, map);
    if (value !== null) {
      year += value;
    }
  }

  return year;
}
