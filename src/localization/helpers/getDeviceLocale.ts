export const getDeviceLocale = (language: string) => {
  switch (language) {
    case 'uk':
      return 'uk-UA';

    case 'de':
      return 'de-DE';

    default:
      return 'en-US';
  }
};
