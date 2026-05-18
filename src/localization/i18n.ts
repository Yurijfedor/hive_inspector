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
import enTaskStatuses from './locales/en/taskStatuses';
import enRelativeDates from './locales/en/relativeDates';
import enToday from './locales/en/today';
import enAnalytics from './locales/en/analytics';
import enTaskEdit from './locales/en/taskEdit';
import enTaskCreate from './locales/en/taskCreate';
import hiveCreateEn from './locales/en/hiveCreate';
import inspectionEn from './locales/en/inspection';
import queenEn from './locales/en/queen';
import swarmEn from './locales/en/swarm';
import diseaseEn from './locales/en/disease';
import splitEn from './locales/en/split';
import hiveEn from './locales/en/hive';
import inspectionHistoryEn from './locales/en/inspectionHistory';
import apiaryEn from './locales/en/apiary';
import apiaryDashboardEn from './locales/en/apiaryDashboard';

// UK
import ukCommon from './locales/uk/common';
import ukNavigation from './locales/uk/navigation';
import ukProfile from './locales/uk/profile';
import ukTasks from './locales/uk/tasks';
import ukTaskTypes from './locales/uk/taskTypes';
import ukTaskPriorities from './locales/uk/taskPriorities';
import ukTaskStatuses from './locales/uk/taskStatuses';
import ukRelativeDates from './locales/uk/relativeDates';
import ukToday from './locales/uk/today';
import ukAnalytics from './locales/uk/analytics';
import ukTaskEdit from './locales/uk/taskEdit';
import ukTaskCreate from './locales/uk/taskCreate';
import hiveCreateUk from './locales/uk/hiveCreate';
import inspectionUk from './locales/uk/inspection';
import queenUk from './locales/uk/queen';
import swarmUk from './locales/uk/swarm';
import diseaseUk from './locales/uk/disease';
import splitUk from './locales/uk/split';
import hiveUk from './locales/uk/hive';
import inspectionHistoryUk from './locales/uk/inspectionHistory';
import apiaryUk from './locales/uk/apiary';
import apiaryDashboardUk from './locales/uk/apiaryDashboard';

// DE
import deCommon from './locales/de/common';
import deNavigation from './locales/de/navigation';
import deProfile from './locales/de/profile';
import deTasks from './locales/de/tasks';
import deTaskTypes from './locales/de/taskTypes';
import deTaskPriorities from './locales/de/taskPriorities';
import deTaskStatuses from './locales/de/taskStatuses';
import deRelativeDates from './locales/de/relativeDates';
import deToday from './locales/de/today';
import deAnalytics from './locales/de/analytics';
import deTaskEdit from './locales/de/taskEdit';
import deTaskCreate from './locales/de/taskCreate';
import hiveCreateDe from './locales/de/hiveCreate';
import inspectionDe from './locales/de/inspection';
import queenDe from './locales/de/queen';
import swarmDe from './locales/de/swarm';
import diseaseDe from './locales/de/disease';
import splitDe from './locales/de/split';
import hiveDe from './locales/de/hive';
import inspectionHistoryDe from './locales/de/inspectionHistory';
import apiaryDe from './locales/de/apiary';
import apiaryDashboardDe from './locales/de/apiaryDashboard';

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
    taskStatuses: enTaskStatuses,
    relativeDates: enRelativeDates,
    today: enToday,
    analytics: enAnalytics,
    taskEdit: enTaskEdit,
    taskCreate: enTaskCreate,
    hiveCreate: hiveCreateEn,
    inspection: inspectionEn,
    queen: queenEn,
    swarm: swarmEn,
    disease: diseaseEn,
    split: splitEn,
    hive: hiveEn,
    inspectionHistory: inspectionHistoryEn,
    apiary: apiaryEn,
    apiaryDashboard: apiaryDashboardEn,
  },

  uk: {
    common: ukCommon,
    navigation: ukNavigation,
    profile: ukProfile,
    tasks: ukTasks,
    taskTypes: ukTaskTypes,
    taskPriorities: ukTaskPriorities,
    taskStatuses: ukTaskStatuses,
    relativeDates: ukRelativeDates,
    today: ukToday,
    analytics: ukAnalytics,
    taskEdit: ukTaskEdit,
    taskCreate: ukTaskCreate,
    hiveCreate: hiveCreateUk,
    inspection: inspectionUk,
    queen: queenUk,
    swarm: swarmUk,
    disease: diseaseUk,
    split: splitUk,
    hive: hiveUk,
    inspectionHistory: inspectionHistoryUk,
    apiary: apiaryUk,
    apiaryDashboard: apiaryDashboardUk,
  },

  de: {
    common: deCommon,
    navigation: deNavigation,
    profile: deProfile,
    tasks: deTasks,
    taskTypes: deTaskTypes,
    taskPriorities: deTaskPriorities,
    taskStatuses: deTaskStatuses,
    relativeDates: deRelativeDates,
    today: deToday,
    analytics: deAnalytics,
    taskEdit: deTaskEdit,
    taskCreate: deTaskCreate,
    hiveCreate: hiveCreateDe,
    inspection: inspectionDe,
    queen: queenDe,
    swarm: swarmDe,
    disease: diseaseDe,
    split: splitDe,
    hive: hiveDe,
    inspectionHistory: inspectionHistoryDe,
    apiary: apiaryDe,
    apiaryDashboard: apiaryDashboardDe,
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
      'taskStatuses',
      'relativeDates',
      'today',
      'analytics',
      'taskEdit',
      'taskCreate',
      'hiveCreate',
      'inspection',
      'queen',
      'swarm',
      'disease',
      'split',
      'hive',
      'inspectionHistory',
      'apiary',
      'apiaryDashboard',
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
