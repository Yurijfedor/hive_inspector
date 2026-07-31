// import i18n from '../localization/i18n';
// import {getVoiceLanguagePack} from './language/getVoiceLanguagePack';

// import {similarity} from '../utils/voiceParser/voiceParser';

// import {NumberEngine} from './parsing/number';
// import {tokenize} from '../utils/voiceParser/voiceParser';
// import {ukLexicon} from './parsing/number/lexicons/uk';

// const engine = new NumberEngine({
//   lexicon: ukLexicon,
// });

// export function parseYear(input: unknown): number | null {
//   if (!input) {
//     return null;
//   }

//   const text = String(input);

//   // пряме число
//   const direct = Number(text);

//   if (!Number.isNaN(direct) && direct > 1900 && direct < 2100) {
//     return direct;
//   }

//   const tokens = tokenize(text);

//   const language = getVoiceLanguagePack(
//     (i18n.language as 'uk' | 'en' | 'de') ?? 'uk',
//   );

//   const thousandWords = language.vocabulary.numbers.keywords.thousand;

//   const index = tokens.findIndex((token) =>
//     thousandWords.some((word) => similarity(token, word) > 0.6),
//   );

//   if (index === -1) {
//     return null;
//   }
//   const tail = tokens.slice(index + 1).join(' ');

//   const result = engine.parse(tail);

//   if (result.value === null) {
//     return null;
//   }

//   return 2000 + result.value;
// }

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
