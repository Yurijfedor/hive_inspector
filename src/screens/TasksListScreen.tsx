import React, {useEffect, useState, useMemo} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';

import {useAuth} from '../auth/AuthProvider';
import {Task} from '../types/task';
import {TaskRepository} from '../domain/repositories/taskRepository';
import {toggleTask} from '../domain/useCases/tasks/toggleTask';

import {
  groupTasksByDate,
  sortTasks,
  getDateLabel,
} from '../services/tasks/taskUtils';

import {TaskItem} from '../components/tasks/TaskItem';

export const TasksListScreen = () => {
  const {user} = useAuth();
  const repo = useMemo(() => new TaskRepository(), []);

  const [tasks, setTasks] = useState<Task[]>([]);

  // 🔽 LOAD LOCAL TASKS (sync already done on app start)
  useEffect(() => {
    const loadTasks = async () => {
      const data = await repo.getAll(); // ✅ БЕЗ uid
      setTasks(data);
    };
    loadTasks();
  }, [repo]);

  // 🔄 TOGGLE COMPLETE
  // const toggleTask = async (id: string) => {
  //   if (!user) return;

  //   const now = Date.now();

  //   const updated = tasks.map((t) =>
  //     t.id === id
  //       ? {
  //           ...t,
  //           completed: !t.completed,
  //           updatedAt: now,
  //           source: 'USER' as const,
  //         }
  //       : t,
  //   );

  //   setTasks(updated);

  //   // ☁️ пушимо тільки при зміні
  //   await repo.saveAll(user.uid, updated);
  // };

  const toggleTaskHandler = async (id: string) => {
    if (!user) return;

    await toggleTask(user.uid, id);

    const updated = await repo.getAll(); // reload після save
    setTasks(updated);
  };

  // 📅 SORT + GROUP
  const sorted = sortTasks(tasks);
  const grouped = groupTasksByDate(sorted);

  const sortedGroups = Object.entries(grouped).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});
