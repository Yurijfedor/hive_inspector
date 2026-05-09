import AsyncStorage from '@react-native-async-storage/async-storage';

import {LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE} from './constants';

import {AppLanguage} from './types';

export async function saveLanguage(language: AppLanguage) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export async function loadLanguage(): Promise<AppLanguage> {
  const value = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (value === 'en' || value === 'uk' || value === 'de') {
    return value;
  }

  return DEFAULT_LANGUAGE;
}
