import {normalizeText, similarity} from '../utils/voiceParser/voiceParser';

function includesFuzzy(
  tokens: string[],
  target: string,
  threshold = 0.65,
): boolean {
  return tokens.some((t) => similarity(t, target) >= threshold);
}

export function parseQueenBreed(input: unknown): string | null {
  if (!input) return null;

  const raw = String(input);
  const text = normalizeText(raw);
  const tokens = text.split(' ');

  // 🔴 1. МІСЦЕВА (найстабільніше слово → перевіряємо першим)
  if (
    tokens.some((t) => t.startsWith('місц')) ||
    includesFuzzy(tokens, 'місцева')
  ) {
    return 'місцева';
  }

  // 🔵 2. КАРНІКА (часто спотворюється)
  if (
    tokens.some((t) => t.startsWith('карн')) ||
    includesFuzzy(tokens, 'карніка') ||
    includesFuzzy(tokens, 'карника') // без і
  ) {
    return 'карніка';
  }

  // 🟠 3. БАКФАСТ (найбільше шуму)
  if (
    tokens.some((t) => t.startsWith('бак')) || // бак, бакф, бакс…
    includesFuzzy(tokens, 'бакфаст') ||
    includesFuzzy(tokens, 'бакфас') ||
    includesFuzzy(tokens, 'фаст') ||
    includesFuzzy(tokens, 'фаст') ||
    includesFuzzy(tokens, 'фас') ||
    includesFuzzy(tokens, 'фауст') // часта помилка
  ) {
    return 'бакфаст';
  }

  return null;
}
