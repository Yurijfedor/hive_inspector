export type DomainIntent = 'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING' | 'NONE';

// 🔹 normalize (єдина точка для всіх парсерів)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’ʼ']/g, '')
    .replace(/[^а-яіїєґ0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 🔹 similarity (той самий lightweight)
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

// 🔹 словники (трохи почистив під normalize)
const swarmWords = [
  'рій',
  'роїння',
  'роїться',
  'маточн',
  'маточник',
  'маточники',
  'рі',
  'мат',
];

const splitWords = [
  'відводок',
  'відводки',
  'відвод',
  'відводу',
  'розділив',
  'відводи',
  'вод',
];

const diseaseWords = [
  'хвороб',
  'проблем',
  'вароа',
  'варооз',
  'кліщ',
  'понос',
  'пронос',
  'крила',
  'деформ',
  'слабкий розплід',
  'дірявий розплід',
];

const feedingWords = [
  'корм',
  'кормити',
  'підгод',
  'підкорм',
  'сироп',
  'цукор',
  'кормлю',
  'кормлення',
  'годівля',
  'годувати',
  'годування',
  'годую',
  'годуй',
];

// 🔥 scoring функція
function scoreIntent(tokens: string[], words: string[]): number {
  let score = 0;

  for (const token of tokens) {
    if (token.length < 3) continue;

    for (const word of words) {
      // exact / includes
      if (token.includes(word)) {
        score += 2;
        continue;
      }

      // fuzzy
      const sim = similarity(token, word);
      if (sim > 0.7) {
        score += 1.5;
      }
    }
  }

  return score;
}

export function detectDomainIntent(input: string): DomainIntent {
  if (!input) return 'NONE';

  const text = normalizeText(input);
  const tokens = text.split(' ');

  // 🔥 score кожного інтенду
  const scores = {
    SWARM: scoreIntent(tokens, swarmWords),
    SPLIT: scoreIntent(tokens, splitWords),
    DISEASE: scoreIntent(tokens, diseaseWords),
    FEEDING: scoreIntent(tokens, feedingWords),
  };

  // 🔥 знайти максимум
  let bestIntent: DomainIntent = 'NONE';
  let bestScore = 0;

  for (const [intent, score] of Object.entries(scores) as [
    DomainIntent,
    number,
  ][]) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  // 🔒 мінімальний поріг (дуже важливо)
  if (bestScore < 2) return 'NONE';

  return bestIntent;
}
