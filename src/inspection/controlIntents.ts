export type ControlIntent = 'PAUSE' | 'RESUME' | 'CANCEL' | 'NONE';

const pauseWords = ['зупини', 'чекай'];
const resumeWords = ['продовж', 'далі', 'можна'];
const cancelWords = ['стоп', 'скасувати', 'завершити', 'закінчити'];

function matches(text: string, words: string[]) {
  return words.some(word => text.includes(word));
}

export function detectControlIntent(text: string): ControlIntent {
  const normalized = text.toLowerCase().trim();

  if (matches(normalized, pauseWords)) return 'PAUSE';
  if (matches(normalized, resumeWords)) return 'RESUME';
  if (matches(normalized, cancelWords)) return 'CANCEL';

  return 'NONE';
}
