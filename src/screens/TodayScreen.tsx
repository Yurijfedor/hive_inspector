import React, {useEffect, useMemo, useState} from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {LineChart} from 'react-native-chart-kit';

import {RootStackParamList} from '../navigation/types';

import {TaskRepository} from '../domain/repositories/taskRepository';

import {Task} from '../types/task';

import {
  buildApiaryDynamics,
  getApiaryStatus,
} from '../services/analytics/apiaryAnalytics';

import {loadInspections} from '../persistence/inspectionRepository';

import {buildTimeline} from '../services/tasks/buildTimeline';

import {groupTasksByType} from '../services/tasks/taskUtils';

import {useAuth} from '../auth/AuthProvider';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {formatDate} from '../localization/helpers/formatDate';

import {getRelativeDateLabel} from '../localization/helpers/getRelativeDateLabel';

import {getTaskTypeLabel} from '../localization/helpers/getTaskTypeLabel';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Hive'>;

export const TodayScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const repo = useMemo(() => {
    return new TaskRepository();
  }, []);

  const {user} = useAuth();

  const uid = user?.uid;

  const {t, currentLanguage} = useAppTranslation();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [chartData, setChartData] = useState<any>(null);

  const [status, setStatus] = useState<'good' | 'warning' | 'critical'>('good');

  const screenWidth = Dimensions.get('window').width;

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // 📦 LOAD TASKS

  useEffect(() => {
    const load = async () => {
      const data = await repo.getAll();

      setTasks(data);
    };

    load();
  }, [repo]);

  // 📊 LOAD ANALYTICS

  useEffect(() => {
    if (!uid) {
      return;
    }

    const loadAnalytics = async () => {
      try {
        const inspections = await loadInspections(uid);

        const points = buildApiaryDynamics(inspections);

        if (points.length === 0) {
          return;
        }

        const chart = {
          labels: points.map((p) => p.date.slice(0, 5)),

          datasets: [
            {
              data: points.map((p) => p.avgStrength),

              color: () => '#4CAF50',

              strokeWidth: 2,
            },

            {
              data: points.map((p) => p.avgHoney),

              color: () => '#FFC107',

              strokeWidth: 2,
            },

            {
              data: points.map((p) => p.avgBroodFrames ?? 0),

              color: () => '#9C27B0',

              strokeWidth: 2,
            },
          ],

          legend: [
            t('analytics:strength'),

            t('analytics:honey'),

            t('analytics:brood'),
          ],
        };

        setChartData(chart);

        setStatus(getApiaryStatus(points));
      } catch (e) {
        console.log('❌ ANALYTICS ERROR', e);
      }
    };

    loadAnalytics();
  }, [uid, t]);

  // 📅 TASKS

  const timeline = buildTimeline(tasks, 5);

  const today = buildTimeline(tasks, 1)[0];

  const handleOpenDay = (day: {date: number}) => {
    setSelectedDay(day.date);
  };

  const handleOpenHive = (hiveNumber: number) => {
    navigation.navigate('Hive', {
      hiveNumber,
    });
  };

  const selectedTasks = timeline.find((d) => d.date === selectedDay)?.tasks;

  const grouped = selectedTasks ? groupTasksByType(selectedTasks) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🐝 TITLE */}

      <Text style={styles.title}>🐝 {t('today:title')}</Text>

      {/* 🧾 TODAY TASKS */}

      {today.tasks.length === 0 ? (
        <Text style={styles.empty}>✅ {t('today:noTasks')}</Text>
      ) : (
        today.tasks.map((task) => (
          <Text key={task.id} style={styles.task}>
            🐝 {t('tasks:hive')} #{task.hiveNumber} — {task.title}
          </Text>
        ))
      )}

      {/* 📅 UPCOMING */}

      <Text style={styles.sectionTitle}>📅 {t('today:upcomingTasks')}</Text>

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
            {getRelativeDateLabel(day.date, t)} ({day.tasks.length})
          </Text>
        </TouchableOpacity>
      ))}

      {/* 📋 SELECTED DAY */}

      {selectedTasks && selectedDay && (
        <View style={styles.details}>
          <Text style={styles.sectionTitle}>
            📋 {formatDate(selectedDay, currentLanguage)}
          </Text>

          {selectedTasks.length === 0 ? (
            <Text style={styles.empty}>{t('tasks:noTasks')}</Text>
          ) : (
            Object.entries(grouped!).map(([type, groupTasks]) => (
              <View key={type} style={styles.group}>
                <Text style={styles.groupTitle}>
                  {getTaskTypeLabel(type as any, t)} ({groupTasks.length})
                </Text>

                {groupTasks.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    onPress={() => handleOpenHive(task.hiveNumber)}>
                    <Text style={styles.task}>
                      🐝 {t('tasks:hive')} #{task.hiveNumber}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      )}

      {/* 📅 OPEN FULL TASK LIST */}

      <TouchableOpacity
        style={styles.syncButton}
        onPress={() => navigation.navigate('TasksList', {})}>
        <Text style={styles.syncText}>📅 {t('today:openFullTaskList')}</Text>
      </TouchableOpacity>

      {/* 🟢 STATUS */}

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {status === 'good' && `🟢 ${t('analytics:apiaryGood')}`}

          {status === 'warning' && `🟡 ${t('analytics:apiaryWarning')}`}

          {status === 'critical' && `🔴 ${t('analytics:apiaryCritical')}`}
        </Text>
      </View>

      {/* 📊 CHART */}

      {chartData && (
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',

            backgroundGradientTo: '#fff',

            decimalPlaces: 0,

            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          bezier
        />
      )}
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

  groupActive: {
    backgroundColor: '#e3f2fd',

    borderRadius: 8,

    padding: 6,

    fontWeight: 'bold',

    color: '#1976d2',
  },

  statusBox: {
    padding: 12,

    borderRadius: 10,

    backgroundColor: '#eef6ff',

    marginTop: 12,
  },

  statusText: {
    fontWeight: '600',
  },

  syncButton: {
    marginTop: 10,

    backgroundColor: '#1976D2',

    padding: 14,

    borderRadius: 12,

    alignItems: 'center',
  },

  syncText: {
    color: '#fff',

    fontWeight: '600',
  },
});
