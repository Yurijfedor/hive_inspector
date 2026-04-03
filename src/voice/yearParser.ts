export function parseYear(input: unknown): number | null {
  if (!input) return null;

  const text = String(input).toLowerCase();

  // 🔢 якщо вже число
  const direct = Number(text);
  if (!isNaN(direct)) return direct;

  // 🧠 словник
  const map: Record<string, number> = {
    нуль: 0,
    один: 1,
    одна: 1,
    два: 2,
    дві: 2,
    три: 3,
    чотири: 4,
    пʼять: 5,
    "п'ять": 5,
    шість: 6,
    сім: 7,
    вісім: 8,
    девʼять: 9,
    "дев'ять": 9,
    десять: 10,
    одинадцять: 11,
    дванадцять: 12,
    тринадцять: 13,
    чотирнадцять: 14,
    пʼятнадцять: 15,
    "п'ятнадцять": 15,
    шістнадцять: 16,
    сімнадцять: 17,
    вісімнадцять: 18,
    девʼятнадцять: 19,
    "дев'ятнадцять": 19,
    двадцять: 20,
    тридцять: 30,
  };

  let year = 0;

  // 👉 "дві тисячі ..."
  if (text.includes('тисяч')) {
    year = 2000;

    const parts = text.split('тисяч')[1]?.trim().split(' ') ?? [];

    for (const word of parts) {
      if (map[word] !== undefined) {
        year += map[word];
      }
    }

    return year;
  }

  return null;
}
