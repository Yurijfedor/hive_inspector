export function getVoiceLanguage(language: string): 'uk' | 'en' | 'de' {
  switch (language) {
    case 'en':
      return 'en';

    case 'de':
      return 'de';

    default:
      return 'uk';
  }
}
