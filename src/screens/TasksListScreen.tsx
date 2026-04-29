import React, {useEffect, useState, useMemo} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

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

// 👉 константи
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
  const repo = useMemo(() => new TaskRepository(), []);
  const navigation = useNavigation<any>();

  const {hives} = useHives();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ACTIVE', // 👈 дефолт
  });

  // 🔽 LOAD LOCAL TASKS
  useEffect(() => {
    const loadTasks = async () => {
      const data = await repo.getAll();
      setTasks(data);
    };
    loadTasks();
  }, [repo]);

  // 🔄 TOGGLE COMPLETE
  const toggleTaskHandler = async (id: string) => {
    if (!user) return;

    await toggleTask(user.uid, id);

    const updated = await repo.getAll();
    setTasks(updated);
  };

  // 🔥 FILTER + SORT + GROUP
  const sortedGroups = useMemo(() => {
    const visibleTasks = tasks.filter((t) => !t.deleted);
    const filteredTasks = filterTasks(visibleTasks, filters);
    const sorted = sortTasks(filteredTasks);
    const grouped = groupTasksByDate(sorted);

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime(),
    );
  }, [tasks, filters]);

  // --------------------------------------------------
  // 🎛 FILTER UI HELPERS
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
      {/* ➕ CREATE */}
      <View style={{marginBottom: 10}}>
        <Button
          title="➕ Додати задачу"
          onPress={() => navigation.navigate('TaskCreate')}
        />
      </View>

      {/* 🎛 FILTERS */}
      <View style={styles.filters}>
        <Text style={styles.filterTitle}>📌 Статус</Text>

        <View style={{flexDirection: 'row'}}>
          <Chip
            label="Активні"
            active={filters.status === 'ACTIVE'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                status: 'ACTIVE',
              }))
            }
          />

          <Chip
            label="Виконані"
            active={filters.status === 'COMPLETED'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                status: 'COMPLETED',
              }))
            }
          />

          <Chip
            label="Всі"
            active={filters.status === 'ALL'}
            onPress={() =>
              setFilters((prev) => ({
                ...prev,
                status: 'ALL',
              }))
            }
          />
        </View>
        <Text style={styles.filterTitle}>📂 Тип</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TASK_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={filters.type === t}
              onPress={() => toggleType(t)}
            />
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>🐝 Вулик</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hives.map((h) => (
            <Chip
              key={h}
              label={`🐝 ${h}`}
              active={filters.hiveNumber === h}
              onPress={() => toggleHive(h)}
            />
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>⚡ Пріоритет</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PRIORITIES.map((p) => (
            <Chip
              key={p}
              label={p}
              active={filters.priority === p}
              onPress={() => togglePriority(p)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setFilters({})}>
          <Text>❌ Очистити фільтри</Text>
        </TouchableOpacity>
      </View>

      {/* 📋 LIST */}
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
// 🔹 CHIP COMPONENT
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
    <Text style={active && {color: '#fff'}}>{label}</Text>
  </TouchableOpacity>
);

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

  clearBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
