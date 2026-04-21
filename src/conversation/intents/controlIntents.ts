export type ControlIntent =
  | 'PAUSE'
  | 'RESUME'
  | 'CANCEL'
  | 'STOP_INSPECTION'
  | 'NONE';

const pauseWords = ['стоп', 'зупини', 'чекай'];
const resumeWords = ['продовж', 'далі', 'можна'];
const cancelWords = ['скасувати', 'завершити', 'закінчити'];

// 🔥 fuzzy слова
const stopKeywords = ['огляд'];
const stopVerbs = ['заверш', 'закінч', 'стоп', 'припини', 'верш'];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function isStopInspection(text: string) {
  return includesAny(text, stopVerbs) && includesAny(text, stopKeywords);
}

export function detectControlIntent(text: string): ControlIntent {
  const normalized = text.toLowerCase().trim();

  // 🔴 FUZZY STOP
  if (isStopInspection(normalized)) {
    return 'STOP_INSPECTION';
  }

  if (includesAny(normalized, pauseWords)) return 'PAUSE';
  if (includesAny(normalized, resumeWords)) return 'RESUME';
  if (includesAny(normalized, cancelWords)) return 'CANCEL';

  return 'NONE';
}
