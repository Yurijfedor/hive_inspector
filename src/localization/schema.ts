import enCommon from './locales/en/common';
import enNavigation from './locales/en/navigation';
import enProfile from './locales/en/profile';
import enTasks from './locales/en/tasks';

export const defaultResources = {
  en: {
    common: enCommon,

    navigation: enNavigation,

    profile: enProfile,

    tasks: enTasks,
  },
} as const;
