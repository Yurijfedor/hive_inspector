import React, {useState, useMemo} from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {useRoute, useNavigation} from '@react-navigation/native';
import {useAuth} from '../auth/AuthProvider';
import {useAppTranslation} from '../hooks/useAppTranslation';

import {Task} from '../types/task';
import {TaskRepository} from '../domain/repositories/taskRepository';

import {formatDate} from '../localization/helpers/formatDate';

export const TasksScreen = () => {
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const {user} = useAuth();

  const {t, currentLanguage} = useAppTranslation();

  const repo = useMemo(() => {
    return new TaskRepository();
  }, []);

  const {initialTasks} = route.params;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // ✏️ UPDATE TITLE
  const updateTitle = (index: number, text: string) => {
    const updated = [...tasks];

    updated[index] = {
      ...updated[index],
      title: text,
    };

    setTasks(updated);
  };

  // 💾 SAVE
  const handleSave = async () => {
    if (!user) {
      return;
    }

    try {
      await repo.saveAll(user.uid, tasks);

      console.log('💾 SAVING TASKS:', tasks);

      navigation.navigate('TasksList');
    } catch (e) {
      console.log('❌ SAVE FAILED', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TITLE */}

      <Text style={styles.screenTitle}>{t('tasks:title')}</Text>

      {/* TASKS */}

      {tasks.length === 0 && (
        <Text style={styles.emptyText}>{t('tasks:noTasks')}</Text>
      )}

      {tasks.map((task, index) => (
        <View key={task.id} style={styles.card}>
          {/* HIVE */}

          <Text style={styles.rowText}>
            🐝 {t('tasks:hive')}: {task.hiveNumber}
          </Text>

          {/* TITLE */}

          <Text style={styles.label}>📌 {t('tasks:title')}</Text>

          <TextInput
            value={task.title}
            onChangeText={(text) => updateTitle(index, text)}
            style={styles.input}
          />

          {/* TYPE */}

          <Text style={styles.rowText}>
            📂 {t('tasks:type')}: {task.type}
          </Text>

          {/* DATE */}

          <Text style={styles.rowText}>
            📅 {t('tasks:dueDate')}: {formatDate(task.date, currentLanguage)}
          </Text>
        </View>
      ))}

      {/* SAVE BUTTON */}

      <View style={styles.saveContainer}>
        <Button title={`💾 ${t('common:save')}`} onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
  },

  card: {
    padding: 12,

    borderWidth: 1,

    borderColor: '#ccc',

    borderRadius: 10,

    marginBottom: 15,
  },

  rowText: {
    fontSize: 15,

    marginTop: 5,
  },

  label: {
    marginTop: 10,

    marginBottom: 5,

    fontWeight: '600',
  },

  input: {
    borderWidth: 1,

    borderColor: '#ddd',

    padding: 8,

    borderRadius: 6,
  },

  saveContainer: {
    marginTop: 20,
  },
});
