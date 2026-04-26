import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {createTask} from '../domain/useCases/tasks/createTask';
import {TaskType, TaskPriority} from '../types/task';

const TASK_TYPES: {label: string; value: TaskType}[] = [
  {label: '🍯 Підгодівля', value: 'FEEDING'},
  {label: '🐝 Огляд', value: 'INSPECTION'},
  {label: '🧬 Хвороби', value: 'DISEASE'},
  {label: '🐝 Роїння', value: 'SWARM'},
  {label: '🪺 Відводки', value: 'SPLIT'},
  {label: '📋 Інше', value: 'OTHER'},
];

export const TaskCreateScreen = () => {
  const navigation = useNavigation<any>();
  const {user} = useAuth();

  const [title, setTitle] = useState('');
  const [hiveNumber, setHiveNumber] = useState('');
  const [type, setType] = useState<TaskType>('INSPECTION');
  const [priority, setPriority] = useState<TaskPriority>('PRIMARY');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  const PRIORITIES: {label: string; value: TaskPriority}[] = [
    {label: '🔥 Важливо', value: 'PRIMARY'},
    {label: '🟢 Звичайно', value: 'SECONDARY'},
  ];

  const handleCreate = async () => {
    if (!user) return;

    if (!title || !hiveNumber) {
      Alert.alert('Помилка', 'Заповни всі поля');
      return;
    }

    try {
      await createTask(user.uid, {
        title,
        hiveNumber: Number(hiveNumber),
        type,
        date: new Date(date).getTime(),
        priority, // ✅ тепер валідний тип
      });

      navigation.goBack();
    } catch (e) {
      console.log('❌ CREATE TASK FAILED', e);
      Alert.alert('Помилка', 'Не вдалося створити задачу');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Нова задача</Text>

      {/* TITLE */}
      <Text>📌 Назва</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Наприклад: Перевірити розплід"
      />

      {/* HIVE */}
      <Text>🐝 Номер вулика</Text>
      <TextInput
        style={styles.input}
        value={hiveNumber}
        onChangeText={setHiveNumber}
        keyboardType="numeric"
        placeholder="Наприклад: 12"
      />

      {/* TYPE */}
      <Text>📂 Тип</Text>
      {TASK_TYPES.map((t) => (
        <Button
          key={t.value}
          title={t.label}
          onPress={() => setType(t.value)}
          color={type === t.value ? '#4CAF50' : '#999'}
        />
      ))}

      <Text>⚡ Пріоритет</Text>

      {PRIORITIES.map((p) => (
        <Button
          key={p.value}
          title={p.label}
          onPress={() => setPriority(p.value)}
          color={priority === p.value ? '#4CAF50' : '#999'}
        />
      ))}

      {/* DATE */}
      <Text style={{marginTop: 10}}>📅 Дата (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <View style={{marginTop: 20}}>
        <Button title="💾 Створити" onPress={handleCreate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});
