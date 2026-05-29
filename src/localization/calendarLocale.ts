import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  today: 'Today',
};

LocaleConfig.locales.uk = {
  monthNames: [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ],

  monthNamesShort: [
    'Січ',
    'Лют',
    'Бер',
    'Кві',
    'Тра',
    'Чер',
    'Лип',
    'Сер',
    'Вер',
    'Жов',
    'Лис',
    'Гру',
  ],

  dayNames: [
    'Неділя',
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'Пʼятниця',
    'Субота',
  ],

  dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],

  today: 'Сьогодні',
};

LocaleConfig.locales.de = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],

  monthNamesShort: [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ],

  dayNames: [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ],

  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],

  today: 'Heute',
};

export const setCalendarLocale = (language: 'uk' | 'en' | 'de') => {
  LocaleConfig.defaultLocale = language;
};
