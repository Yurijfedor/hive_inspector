import React, {useMemo} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../navigation/types';

import {Task} from '../../types/task';

import {groupTasksByType} from '../../services/tasks/taskUtils';

import {useAppTranslation} from '../../hooks/useAppTranslation';

import {formatDate} from '../../localization/helpers/formatDate';

import {getTaskTypeLabel} from '../../localization/helpers/getTaskTypeLabel';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  selectedDate: string | null;

  tasks: Task[];
};

export const SelectedDayTasks = ({selectedDate, tasks}: Props) => {
  const navigation = useNavigation<NavigationProp>();

  const {t, currentLanguage} = useAppTranslation();

  const groupedTasks = useMemo(() => {
    return groupTasksByType(tasks);
  }, [tasks]);

  if (!selectedDate) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📋 {formatDate(selectedDate, currentLanguage)}
      </Text>

      {tasks.length === 0 ? (
        <Text style={styles.empty}>{t('tasks:noTasks')}</Text>
      ) : (
        Object.entries(groupedTasks).map(([type, groupTasks]) => (
          <View key={type} style={styles.group}>
            <Text style={styles.groupTitle}>
              {getTaskTypeLabel(type as any, t)} ({groupTasks.length})
            </Text>

            {groupTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() =>
                  navigation.navigate('Hive', {
                    hiveNumber: task.hiveNumber,
                  })
                }>
                <Text style={styles.taskHive}>
                  🐝 {t('tasks:hive')} #{task.hiveNumber}
                </Text>

                <Text style={styles.taskTitle}>{task.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  empty: {
    fontSize: 16,
  },

  group: {
    marginBottom: 12,
  },

  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  taskCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  taskHive: {
    fontWeight: '600',
    fontSize: 16,
  },

  taskTitle: {
    marginTop: 4,
    color: '#666',
  },
});
