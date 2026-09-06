import {VoiceLanguage} from './language/VoiceLanguagePack';
import {getNumberEngineForLanguage} from './parsing/number/getNumberEngineForLanguage';

export function parseYear(
  input: unknown,
  language: VoiceLanguage,
): number | null {
  if (!input) {
    return null;
  }

  const text = String(input).trim();

  // -------------------------
  // DIRECT YEAR
  // -------------------------

  // Наприклад:
  // "2024" → 2024
  const direct = Number(text);

  if (!Number.isNaN(direct) && direct > 1900 && direct < 2100) {
    return direct;
  }

  // -------------------------
  // SPOKEN SHORT YEAR
  // -------------------------

  // uk: "двадцять чотири" → 24
  // en: "twenty four" → 24
  // de: "vierundzwanzig" → 24
  const result = getNumberEngineForLanguage(language).parse(text);

  if (result.value === null) {
    return null;
  }

  const shortYear = result.value;

  // Для поточної задачі приймаємо тільки хвіст року:
  // 0..99 → 2000..2099
  if (shortYear < 0 || shortYear > 99) {
    return null;
  }

  return 2000 + shortYear;
}
