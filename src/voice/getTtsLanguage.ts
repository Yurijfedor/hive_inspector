import type {VoiceLanguage} from './language/VoiceLanguagePack';

export function getTtsLanguage(language: VoiceLanguage): string {
  switch (language) {
    case 'en':
      return 'en-US';

    case 'de':
      return 'de-DE';

    case 'uk':
    default:
      return 'uk-UA';
  }
}
