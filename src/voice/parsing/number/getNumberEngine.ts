import i18n from '../../../localization/i18n';

import {VoiceLanguage} from '../../language/VoiceLanguagePack';

import {createNumberEngine} from './createNumberEngine';
import {NumberEngine} from './NumberEngine';
import {enLexicon, ukLexicon} from './lexicons';

const cache: Partial<Record<VoiceLanguage, NumberEngine>> = {};

export function getNumberEngine(): NumberEngine {
  const language = (i18n.language as VoiceLanguage) ?? 'uk';

  if (cache[language]) {
    return cache[language]!;
  }

  switch (language) {
    case 'en':
      cache.en = createNumberEngine(enLexicon);
      break;

    case 'de':
      // Поки що використовуємо український, щоб застосунок працював.
      // Коли з'явиться deLexicon, достатньо буде змінити один рядок.
      cache.de = createNumberEngine(ukLexicon);
      break;

    case 'uk':
    default:
      cache.uk = createNumberEngine(ukLexicon);
      break;
  }

  return cache[language]!;
}
