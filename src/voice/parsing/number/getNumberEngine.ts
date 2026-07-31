import i18n from '../../../localization/i18n';

import {VoiceLanguage} from '../../language/VoiceLanguagePack';
import {NumberEngine} from './NumberEngine';
import {getNumberEngineForLanguage} from './getNumberEngineForLanguage';

export function getNumberEngine(): NumberEngine {
  const language = (i18n.language as VoiceLanguage) ?? 'uk';

  return getNumberEngineForLanguage(language);
}
