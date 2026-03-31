import React, {useEffect, useMemo, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

import {TaskRepository} from '../domain/repositories/taskRepository';
import {Task} from '../types/task';

import {buildTimeline} from '../services/tasks/buildTimeline';
import {getRelativeDateLabel} from '../services/tasks/getRelativeDateLabel';
import {formatDate, groupTasksByType} from '../services/tasks/taskUtils';
import {getTaskTypeLabel} from '../services/tasks/getTaskTypeLabel';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Hive'>;

export const TodayScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const repo = useMemo(() => new TaskRepository(), []);

  const [tasks, setTasks] = useState<Task[]>([]);
  console.log('📅 TASKS:', tasks);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await repo.getAll();
      console.log('📅 DATA:', data);

      setTasks(data);
    };
    load();
  }, [repo]);

  const timeline = buildTimeline(tasks, 5);
  console.log('📅 TIMELINE:', timeline);

  const today = buildTimeline(tasks, 1)[0];

  const handleOpenDay = (day: {date: number}) => {
    setSelectedDay(day.date);
  };

  const handleOpenHive = (hiveNumber: number) => {
    navigation.navigate('Hive', {hiveNumber});
  };

  const selectedTasks = timeline.find((d) => d.date === selectedDay)?.tasks;
  console.log('📅 SELECTED DAY TASKS:', selectedTasks);

  const grouped = selectedTasks ? groupTasksByType(selectedTasks) : null;
  console.log('📂 GROUPED TASKS:', grouped);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🐝 Сьогодні</Text>

      {today.tasks.length === 0 ? (
        <Text style={styles.empty}>✅ Сьогодні задач немає</Text>
      ) : (
        today.tasks.map((task) => (
          <Text key={task.id} style={styles.task}>
            🐝 Вулик {task.hiveNumber} — {task.title}
          </Text>
        ))
      )}

      <Text style={styles.sectionTitle}>📅 План на дні</Text>

      {timeline.map((day) => (
        <TouchableOpacity
          key={day.date}
          style={styles.group}
          onPress={() => handleOpenDay(day)}>
          <Text
            style={[
              styles.groupTitle,
              selectedDay === day.date && styles.groupActive,
            ]}>
            {getRelativeDateLabel(day.date)} ({day.tasks.length})
          </Text>
        </TouchableOpacity>
      ))}

      {/* 📋 Selected day tasks */}
      {selectedTasks && selectedDay && (
        <View style={styles.details}>
          <Text style={styles.sectionTitle}>
            📋 Задачі на {formatDate(selectedDay)}
          </Text>

          {selectedTasks.length === 0 ? (
            <Text style={styles.empty}>Немає задач</Text>
          ) : (
            Object.entries(grouped!).map(([type, groupTasks]) => (
              <View key={type} style={styles.group}>
                <Text style={styles.groupTitle}>
                  {getTaskTypeLabel(type)} ({groupTasks.length})
                </Text>

                {groupTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleOpenHive(task.hiveNumber)}>
                    <Text style={styles.task}>🐝 Вулик {task.hiveNumber}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      )}

      {/* 📆 Calendar link */}
      <Text style={styles.link}>📆 Відкрити календар</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },

  empty: {
    fontSize: 16,
    marginBottom: 16,
  },

  group: {
    marginBottom: 12,
  },

  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  details: {
    marginTop: 16,
  },

  task: {
    fontSize: 16,
    marginBottom: 6,
  },

  link: {
    marginTop: 16,
    color: 'blue',
  },

  groupActive: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 6,
    fontWeight: 'bold',
    color: '#1976d2',
  },
});
