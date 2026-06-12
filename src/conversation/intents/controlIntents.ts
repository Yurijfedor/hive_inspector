import {getVoiceLanguagePack} from '../../voice/language/getVoiceLanguagePack';
import i18n from '../../localization/i18n';

export type ControlIntent =
  | 'PAUSE'
  | 'RESUME'
  | 'CANCEL'
  | 'STOP_INSPECTION'
  | 'NONE';

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function isStopInspection(
  text: string,
  stopVerbs: string[],
  stopKeywords: string[],
) {
  return includesAny(text, stopVerbs) && includesAny(text, stopKeywords);
}

export function detectControlIntent(text: string): ControlIntent {
  const normalized = text.toLowerCase().trim();

  const language = getVoiceLanguagePack(
    (i18n.language as 'uk' | 'en' | 'de') ?? 'uk',
  );

  const {pauseWords, resumeWords, cancelWords, stopKeywords, stopVerbs} =
    language.control;

  if (isStopInspection(normalized, stopVerbs, stopKeywords)) {
    return 'STOP_INSPECTION';
  }

  if (includesAny(normalized, pauseWords)) {
    return 'PAUSE';
  }

  if (includesAny(normalized, resumeWords)) {
    return 'RESUME';
  }

  if (includesAny(normalized, cancelWords)) {
    return 'CANCEL';
  }

  return 'NONE';
}
