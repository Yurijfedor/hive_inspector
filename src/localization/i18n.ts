import i18n from 'i18next';

import {initReactI18next} from 'react-i18next';
import {DEFAULT_LANGUAGE} from './constants';
import {getDeviceLanguage} from './helpers/getDeviceLanguage';
import {loadLanguage, saveLanguage} from './storage';

// EN
import enCommon from './locales/en/common';
import enNavigation from './locales/en/navigation';
import enProfile from './locales/en/profile';
import enTasks from './locales/en/tasks';
import enTaskTypes from './locales/en/taskTypes';
import enTaskPriorities from './locales/en/taskPriorities';

// UK
import ukCommon from './locales/uk/common';
import ukNavigation from './locales/uk/navigation';
import ukProfile from './locales/uk/profile';
import ukTasks from './locales/uk/tasks';
import ukTaskTypes from './locales/uk/taskTypes';
import ukTaskPriorities from './locales/uk/taskPriorities';

// DE
import deCommon from './locales/de/common';
import deNavigation from './locales/de/navigation';
import deProfile from './locales/de/profile';
import deTasks from './locales/de/tasks';
import deTaskTypes from './locales/de/taskTypes';
import deTaskPriorities from './locales/de/taskPriorities';

import {AppLanguage} from './types';

// ========================================
// TRANSLATION RESOURCES
// ========================================

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    profile: enProfile,
    tasks: enTasks,
    taskTypes: enTaskTypes,
    taskPriorities: enTaskPriorities,
  },

  uk: {
    common: ukCommon,
    navigation: ukNavigation,
    profile: ukProfile,
    tasks: ukTasks,
    taskTypes: ukTaskTypes,
    taskPriorities: ukTaskPriorities,
  },

  de: {
    common: deCommon,
    navigation: deNavigation,
    profile: deProfile,
    tasks: deTasks,
    taskTypes: deTaskTypes,
    taskPriorities: deTaskPriorities,
  },
};

// ========================================
// INIT
// ========================================

export async function initLocalization() {
  let language: AppLanguage = DEFAULT_LANGUAGE;

  try {
    const savedLanguage = await loadLanguage();

    language = savedLanguage;
  } catch (e) {
    console.log('❌ LOAD LANGUAGE FAILED', e);

    language = getDeviceLanguage();
  }

  await i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',

    lng: language,

    fallbackLng: DEFAULT_LANGUAGE,

    resources,

    defaultNS: 'common',

    ns: [
      'common',
      'navigation',
      'profile',
      'tasks',
      'taskTypes',
      'taskPriorities',
    ],

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

  console.log('🌍 LOCALIZATION READY:', language);
}

// ========================================
// LANGUAGE SWITCH
// ========================================

export async function setAppLanguage(language: AppLanguage) {
  try {
    await saveLanguage(language);

    await i18n.changeLanguage(language);

    console.log('🌍 LANGUAGE CHANGED:', language);
  } catch (e) {
    console.log('❌ CHANGE LANGUAGE FAILED', e);
  }
}

export default i18n;
