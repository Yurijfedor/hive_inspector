import * as RNLocalize from 'react-native-localize';

import {AppLanguage} from '../types';

export function getDeviceLanguage(): AppLanguage {
  const locale = RNLocalize.getLocales()[0];

  if (!locale) {
    return 'en';
  }

  switch (locale.languageCode) {
    case 'uk':
      return 'uk';

    case 'de':
      return 'de';

    default:
      return 'en';
  }
}
