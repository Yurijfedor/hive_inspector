import enCommon from './locales/en/common';
import enNavigation from './locales/en/navigation';
import enProfile from './locales/en/profile';

export const defaultResources = {
  en: {
    common: enCommon,

    navigation: enNavigation,

    profile: enProfile,
  },
} as const;
