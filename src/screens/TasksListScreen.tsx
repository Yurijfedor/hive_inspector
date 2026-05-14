import React, {useEffect, useState, useMemo} from 'react';

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';

import {Task, TaskType, TaskPriority} from '../types/task';

import {TaskRepository} from '../domain/repositories/taskRepository';

import {toggleTask} from '../domain/useCases/tasks/toggleTask';

import {filterTasks, TaskFilters} from '../services/tasks/filterTasks';

import {
  groupTasksByDate,
  sortTasks,
  getDateLabel,
} from '../services/tasks/taskUtils';

import {TaskItem} from '../components/tasks/TaskItem';

import {useHives} from '../hooks/useHives';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {getTaskTypeLabel} from '../localization/helpers/getTaskTypeLabel';

import {getTaskPriorityLabel} from '../localization/helpers/getTaskPriorityLabel';

// 👉 constants

const TASK_TYPES: TaskType[] = [
  'FEEDING',
  'INSPECTION',
  'DISEASE',
  'SWARM',
  'SPLIT',
  'OTHER',
];

const PRIORITIES: TaskPriority[] = ['PRIMARY', 'SECONDARY'];

export const TasksListScreen = () => {
  const {user} = useAuth();

  const repo = useMemo(() => {
    return new TaskRepository();
  }, []);

  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  const {hives} = useHives();

  const {t} = useAppTranslation();

  const hiveNumberFromRoute = route.params?.hiveNumber;

  const [tasks, setTasks] = useState<Task[]>([]);

  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ACTIVE',

    hiveNumber: hiveNumberFromRoute,
  });

  // 🔽 LOAD TASKS

  useEffect(() => {
    const loadTasks = async () => {
      const data = await repo.getAll();

      setTasks(data);
    };

    loadTasks();
  }, [repo]);

  // 🔄 TOGGLE COMPLETE

  const toggleTaskHandler = async (id: string) => {
    if (!user) {
      return;
    }

    await toggleTask(user.uid, id);

    const updated = await repo.getAll();

    setTasks(updated);
  };

  // 🔥 FILTER + SORT + GROUP

  const sortedGroups = useMemo(() => {
    const visibleTasks = tasks.filter((task) => !task.deleted);

    const filteredTasks = filterTasks(visibleTasks, filters);

    const sorted = sortTasks(filteredTasks);

    const grouped = groupTasksByDate(sorted);

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    );
  }, [tasks, filters]);

  // --------------------------------------------------
  // 🎛 FILTER HELPERS
  // --------------------------------------------------

  const toggleType = (type: TaskType) => {
    setFilters((prev) => ({
      ...prev,

      type: prev.type === type ? undefined : type,
    }));
  };

  const toggleHive = (hive: number) => {
    setFilters((prev) => ({
      ...prev,

      hiveNumber: prev.hiveNumber === hive ? undefined : hive,
    }));
  };

  const togglePriority = (priority: TaskPriority) => {
    setFilters((prev) => ({
      ...prev,

      priority: prev.priority === priority ? undefined : priority,
    }));
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {hiveNumberFromRoute && (
        <Text style={styles.contextTitle}>
          🐝 {t('tasks:hive')} #{hiveNumberFromRoute}
        </Text>
      )}

      {/* ➕ CREATE */}

      <View style={styles.createContainer}>
        <Button
          title={`${t('navigation:createTask')}`}
          onPress={() => navigation.navigate('TaskCreate')}
        />
      </View>

      {/* 🎛 FILTERS */}

      <View style={styles.filters}>
        {/* STATUS */}

        <Text style={styles.filterTitle}>📌 {t('tasks:status')}</Text>

        <View style={styles.row}>
          <Chip
            label={t('taskStatuses:ACTIVE')}
            active={filters.status === 'ACTIVE'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,

                status: 'ACTIVE',
              }))
            }
          />

          <Chip
            label={t('taskStatuses:COMPLETED')}
            active={filters.status === 'COMPLETED'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,

                status: 'COMPLETED',
              }))
            }
          />

          <Chip
            label={t('taskStatuses:ALL')}
            active={filters.status === 'ALL'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,

                status: 'ALL',
              }))
            }
          />
        </View>

        {/* TYPE */}

        <Text style={styles.filterTitle}>📂 {t('tasks:type')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TASK_TYPES.map((type) => (
            <Chip
              key={type}
              label={getTaskTypeLabel(type, t)}
              active={filters.type === type}
              onPress={() => toggleType(type)}
            />
          ))}
        </ScrollView>

        {/* HIVE */}

        {!hiveNumberFromRoute && (
          <>
            <Text style={styles.filterTitle}>🐝 {t('tasks:hive')}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {hives.map((hive) => (
                <Chip
                  key={hive}
                  label={`🐝 ${hive}`}
                  active={filters.hiveNumber === hive}
                  onPress={() => toggleHive(hive)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* PRIORITY */}

        <Text style={styles.filterTitle}>⚡ {t('tasks:priority')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PRIORITIES.map((priority) => (
            <Chip
              key={priority}
              label={getTaskPriorityLabel(priority, t)}
              active={filters.priority === priority}
              onPress={() => togglePriority(priority)}
            />
          ))}
        </ScrollView>

        {/* CLEAR */}

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setFilters({})}>
          <Text>❌ {t('tasks:clearFilters')}</Text>
        </TouchableOpacity>
      </View>

      {/* 📋 TASK LIST */}

      {sortedGroups.map(([date, groupTasks]) => (
        <View key={date}>
          <Text style={styles.date}>
            {getDateLabel(new Date(date).getTime())}
          </Text>

          {groupTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTaskHandler(task.id)}
              onPress={() => navigation.navigate('TaskEdit', {task})}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

// --------------------------------------------------
// 🔹 CHIP
// --------------------------------------------------

const Chip = ({
  label,
  active,
  onPress,
}: {
  label: string;

  active: boolean;

  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.activeChip]}>
    <Text style={active ? styles.activeChipText : undefined}>{label}</Text>
  </TouchableOpacity>
);

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  createContainer: {
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
  },

  date: {
    fontSize: 18,

    fontWeight: 'bold',

    marginTop: 16,
  },

  filters: {
    marginBottom: 16,
  },

  filterTitle: {
    fontWeight: '600',

    marginTop: 10,

    marginBottom: 6,
  },

  chip: {
    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#ccc',

    marginRight: 6,
  },

  activeChip: {
    backgroundColor: '#4CAF50',

    borderColor: '#4CAF50',
  },

  activeChipText: {
    color: '#fff',
  },

  clearBtn: {
    marginTop: 10,

    alignSelf: 'flex-start',
  },

  contextTitle: {
    fontSize: 18,

    fontWeight: '600',

    marginBottom: 10,
  },
});
