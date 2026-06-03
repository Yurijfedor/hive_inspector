import React from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {TFunction} from 'i18next';

import {getRelativeDateLabel} from '../../localization/helpers/getRelativeDateLabel';

type TimelineDay = {
  date: number;
  tasks: unknown[];
};

type Props = {
  timeline: TimelineDay[];

  selectedDate: string | null;

  onSelectDate: (date: string) => void;

  t: TFunction;
};

export const UpcomingTasks = ({
  timeline,
  selectedDate,
  onSelectDate,
  t,
}: Props) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>📅 {t('today:upcomingTasks')}</Text>

      {timeline.map((day) => {
        const dayKey = new Date(day.date).toISOString().split('T')[0];

        return (
          <TouchableOpacity
            key={day.date}
            style={styles.group}
            onPress={() => onSelectDate(dayKey)}>
            <Text
              style={[
                styles.groupTitle,

                selectedDate === dayKey && styles.groupActive,
              ]}>
              {getRelativeDateLabel(day.date, t)} ({day.tasks.length})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },

  group: {
    marginBottom: 12,
  },

  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  groupActive: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 6,
    fontWeight: 'bold',
    color: '#1976d2',
  },
});
