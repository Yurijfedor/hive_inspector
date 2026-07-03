import i18n from '../../../localization/i18n';

import {getVoiceLanguagePack} from '../../language/getVoiceLanguagePack';
import {VoiceLanguage} from '../../language/VoiceLanguagePack';

import {createNumberEngine} from './createNumberEngine';
import {ukLexicon, enLexicon} from './lexicons';

export function getNumberEngine() {
  const language = (i18n.language as VoiceLanguage) ?? 'uk';

  getVoiceLanguagePack(language);

  switch (language) {
    case 'en':
      return createNumberEngine(enLexicon);

    case 'uk':
    default:
      return createNumberEngine(ukLexicon);
  }
}
