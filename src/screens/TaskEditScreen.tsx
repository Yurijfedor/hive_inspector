import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {useAuth} from '../auth/AuthProvider';
import {Task, TaskType} from '../types/task';
import {formatDateUA} from '../utils/date/formatDate';
import {parseDateUA} from '../utils/date/parseDate';

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
  //   const [date, setDate] = useState(
  //     new Date(task.date).toISOString().split('T')[0],
  //   );
  const [date, setDate] = useState(task.date);
  const [dateInput, setDateInput] = useState(formatDateUA(task.date));
  const [showPicker, setShowPicker] = useState(false);

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
        date, // 👈 вже number
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
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>✏️ Редагування задачі</Text>

        {/* TITLE */}
        <Text style={styles.label}>📌 Назва</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        {/* HIVE */}
        <Text style={styles.label}>🐝 Вулик</Text>
        <TextInput
          style={styles.input}
          value={hiveNumber}
          onChangeText={setHiveNumber}
          keyboardType="numeric"
        />

        {/* TYPE */}
        <Text style={styles.label}>📂 Тип</Text>
        <View style={styles.typeContainer}>
          {TASK_TYPES.map((t) => {
            const active = type === t.value;

            return (
              <Text
                key={t.value}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setType(t.value)}>
                {t.label}
              </Text>
            );
          })}
        </View>

        {/* DATE */}
        <Text style={styles.label}>📅 Дата</Text>

        <View style={styles.dateRow}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            value={dateInput}
            onChangeText={(text) => {
              setDateInput(text);

              const parsed = parseDateUA(text);
              if (parsed) setDate(parsed);
            }}
            placeholder="ДД-ММ-РРРР"
          />

          <Text style={styles.calendarBtn} onPress={() => setShowPicker(true)}>
            📅
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={{marginTop: 24}}>
          <Button title="💾 Зберегти" onPress={handleSave} />
        </View>

        <View style={{marginTop: 10}}>
          <Button title="🗑 Видалити" color="red" onPress={handleDelete} />
        </View>

        {/* DATE PICKER */}
        {showPicker && (
          <DateTimePicker
            value={new Date(date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);

              if (selectedDate) {
                const ts = selectedDate.getTime();
                setDate(ts);
                setDateInput(formatDateUA(ts));
              }
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  // 🔥 TYPES
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },

  typeChipActive: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },

  // 🔥 DATE
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  calendarBtn: {
    fontSize: 22,
    padding: 8,
  },
});
