import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {Task, TaskType} from '../types/task';

import {updateTask} from '../domain/useCases/tasks/updateTask';
import {deleteTask} from '../domain/useCases/tasks/deleteTask';

const TASK_TYPES: {label: string; value: TaskType}[] = [
  {label: '🍯 Підгодівля', value: 'FEEDING'},
  {label: '🐝 Огляд', value: 'INSPECTION'},
  {label: '🧬 Хвороби', value: 'DISEASE'},
  {label: '🐝 Роїння', value: 'SWARM'},
  {label: '🪺 Відводки', value: 'SPLIT'},
];

export const TaskEditScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {user} = useAuth();

  const {task}: {task: Task} = route.params;

  const [title, setTitle] = useState(task.title);
  const [hiveNumber, setHiveNumber] = useState(String(task.hiveNumber));
  const [type, setType] = useState<TaskType>(task.type);
  const [date, setDate] = useState(
    new Date(task.date).toISOString().split('T')[0],
  );

  // 💾 SAVE
  const handleSave = async () => {
    if (!user) return;

    if (!title || !hiveNumber) {
      Alert.alert('Помилка', 'Заповни всі поля');
      return;
    }

    try {
      await updateTask(user.uid, {
        ...task,
        title,
        hiveNumber: Number(hiveNumber),
        type,
        date: new Date(date).getTime(),
      });

      navigation.goBack();
    } catch (e) {
      console.log('❌ UPDATE FAILED', e);
      Alert.alert('Помилка', 'Не вдалося зберегти');
    }
  };

  // 🗑 DELETE
  const handleDelete = async () => {
    if (!user) return;

    Alert.alert('Видалити задачу?', 'Це не можна скасувати', [
      {text: 'Скасувати', style: 'cancel'},
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(user.uid, task.id);
            navigation.goBack();
          } catch (e) {
            console.log('❌ DELETE FAILED', e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Редагування задачі</Text>

      {/* TITLE */}
      <Text>📌 Назва</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      {/* HIVE */}
      <Text>🐝 Вулик</Text>
      <TextInput
        style={styles.input}
        value={hiveNumber}
        onChangeText={setHiveNumber}
        keyboardType="numeric"
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

      {/* DATE */}
      <Text style={{marginTop: 10}}>📅 Дата</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <View style={{marginTop: 20}}>
        <Button title="💾 Зберегти" onPress={handleSave} />
      </View>

      <View style={{marginTop: 10}}>
        <Button title="🗑 Видалити" color="red" onPress={handleDelete} />
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
