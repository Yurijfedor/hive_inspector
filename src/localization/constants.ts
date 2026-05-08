import {AppLanguage} from './types';

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = 'app_language';

export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
  },

  {
    code: 'uk',
    label: 'Українська',
  },

  {
    code: 'de',
    label: 'Deutsch',
  },
] as const;
