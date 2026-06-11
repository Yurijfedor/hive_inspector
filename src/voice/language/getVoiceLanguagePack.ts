import {VoiceLanguage, VoiceLanguagePack} from './VoiceLanguagePack';

import {ukPack} from './packs/uk';
import {enPack} from './packs/en';
import {dePack} from './packs/de';

export function getVoiceLanguagePack(
  language: VoiceLanguage,
): VoiceLanguagePack {
  switch (language) {
    case 'en':
      return enPack;

    case 'de':
      return dePack;

    case 'uk':
    default:
      return ukPack;
  }
}
