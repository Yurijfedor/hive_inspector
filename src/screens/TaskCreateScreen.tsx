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
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {useAuth} from '../auth/AuthProvider';
import {createTask} from '../domain/useCases/tasks/createTask';
import {TaskType, TaskPriority} from '../types/task';

import {formatDateUA} from '../utils/date/formatDate';
import {parseDateUA} from '../utils/date/parseDate';

const TASK_TYPES: {label: string; value: TaskType}[] = [
  {label: '🍯 Підгодівля', value: 'FEEDING'},
  {label: '🐝 Огляд', value: 'INSPECTION'},
  {label: '🧬 Хвороби', value: 'DISEASE'},
  {label: '🐝 Роїння', value: 'SWARM'},
  {label: '🪺 Відводки', value: 'SPLIT'},
  {label: '📋 Інше', value: 'OTHER'},
];

const PRIORITIES: {label: string; value: TaskPriority}[] = [
  {label: '🔥 Важливо', value: 'PRIMARY'},
  {label: '🟢 Звичайно', value: 'SECONDARY'},
];

export const TaskCreateScreen = () => {
  const navigation = useNavigation<any>();
  const {user} = useAuth();

  const [title, setTitle] = useState('');
  const [hiveNumber, setHiveNumber] = useState('');
  const [type, setType] = useState<TaskType>('INSPECTION');
  const [priority, setPriority] = useState<TaskPriority>('PRIMARY');

  const [date, setDate] = useState(Date.now());
  const [dateInput, setDateInput] = useState(formatDateUA(Date.now()));
  const [showPicker, setShowPicker] = useState(false);

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
        date,
        priority,
      });

      navigation.goBack();
    } catch (e) {
      console.log('❌ CREATE TASK FAILED', e);
      Alert.alert('Помилка', 'Не вдалося створити задачу');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>➕ Нова задача</Text>

        {/* TITLE */}
        <Text style={styles.label}>📌 Назва</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Наприклад: Перевірити розплід"
        />

        {/* HIVE */}
        <Text style={styles.label}>🐝 Вулик</Text>
        <TextInput
          style={styles.input}
          value={hiveNumber}
          onChangeText={setHiveNumber}
          keyboardType="numeric"
          placeholder="Наприклад: 12"
        />

        {/* TYPE */}
        <Text style={styles.label}>📂 Тип</Text>
        <View style={styles.chipContainer}>
          {TASK_TYPES.map((t) => {
            const active = type === t.value;

            return (
              <Text
                key={t.value}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setType(t.value)}>
                {t.label}
              </Text>
            );
          })}
        </View>

        {/* PRIORITY */}
        <Text style={styles.label}>⚡ Пріоритет</Text>
        <View style={styles.chipContainer}>
          {PRIORITIES.map((p) => {
            const active = priority === p.value;

            return (
              <Text
                key={p.value}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setPriority(p.value)}>
                {p.label}
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

        <View style={{marginTop: 24}}>
          <Button title="💾 Створити" onPress={handleCreate} />
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

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
  },

  chipActive: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },

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
