import React from 'react';

import {Calendar} from 'react-native-calendars';

type Props = {
  markedDates: Record<string, any>;

  onSelectDate: (date: string) => void;
};

export const TaskCalendar = ({markedDates, onSelectDate}: Props) => {
  return (
    <Calendar
      markedDates={markedDates}
      onDayPress={(day) => {
        onSelectDate(day.dateString);
      }}
    />
  );
};
