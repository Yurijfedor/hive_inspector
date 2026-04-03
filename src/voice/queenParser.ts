export function parseQueenBreed(input: unknown): string | null {
  if (!input) return null;

  const text = String(input).toLowerCase();

  // 🟡 МІСЦЕВА
  if (text.includes('місц')) return 'місцева';

  // 🟡 КАРНІКА
  if (text.includes('карн')) return 'карніка';

  // 🟡 БАКФАСТ
  if (text.includes('бак') || text.includes('фауст') || text.includes('фаст')) {
    return 'бакфаст';
  }

  return null;
}
