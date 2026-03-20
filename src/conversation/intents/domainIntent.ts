export type DomainIntent = 'SWARM' | 'SPLIT' | 'DISEASE' | 'FEEDING' | 'NONE';

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
  'відводу', // 🔥 вже бачиш у логах
  'розділив',
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

function matches(text: string, words: string[]) {
  const tokens = text.split(/\s+/);

  return words.some(word =>
    tokens.some(token => token.length >= 3 && token.includes(word)),
  );
}

export function detectDomainIntent(text: string): DomainIntent {
  const normalized = text.toLowerCase().trim();

  if (matches(normalized, swarmWords)) return 'SWARM';
  if (matches(normalized, splitWords)) return 'SPLIT';
  if (matches(normalized, diseaseWords)) return 'DISEASE';
  if (matches(normalized, feedingWords)) return 'FEEDING';

  return 'NONE';
}
