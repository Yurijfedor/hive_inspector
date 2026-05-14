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

export const defaultResources = {
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
  },
} as const;
