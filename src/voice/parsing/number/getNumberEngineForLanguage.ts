import {VoiceLanguage} from '../../language/VoiceLanguagePack';

import {createNumberEngine} from './createNumberEngine';
import {NumberEngine} from './NumberEngine';
import {deLexicon, enLexicon, ukLexicon} from './lexicons';
import {preprocessGermanNumber} from './preprocessors/deGermanNumberPreprocessor';

const cache: Partial<Record<VoiceLanguage, NumberEngine>> = {};

export function getNumberEngineForLanguage(
  language: VoiceLanguage,
): NumberEngine {
  if (cache[language]) {
    return cache[language]!;
  }

  switch (language) {
    case 'en':
      cache.en = createNumberEngine(enLexicon);
      break;

    case 'de':
      cache.de = createNumberEngine(deLexicon, preprocessGermanNumber);
      break;

    case 'uk':
    default:
      cache.uk = createNumberEngine(ukLexicon);
      break;
  }

  return cache[language]!;
}
