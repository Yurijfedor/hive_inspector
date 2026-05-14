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

import {useHives} from '../hooks/useHives';

import {HiveSelector} from '../components/HiveSelector';

import {createTask} from '../domain/useCases/tasks/createTask';

import {TaskType, TaskPriority} from '../types/task';

import {parseDateUA} from '../utils/date/parseDate';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {formatDate} from '../localization/helpers/formatDate';

import {getTaskTypeLabel} from '../localization/helpers/getTaskTypeLabel';

import {getTaskPriorityLabel} from '../localization/helpers/getTaskPriorityLabel';

// 🔥 TASK TYPES

const TASK_TYPES: TaskType[] = [
  'FEEDING',
  'INSPECTION',
  'DISEASE',
  'SWARM',
  'SPLIT',
  'OTHER',
];

// ⚡ PRIORITIES

const PRIORITIES: TaskPriority[] = ['PRIMARY', 'SECONDARY'];

export const TaskCreateScreen = () => {
  const navigation = useNavigation<any>();

  const {user} = useAuth();

  const {hives} = useHives();

  const {t, currentLanguage} = useAppTranslation();

  // 📝 FORM

  const [title, setTitle] = useState('');

  const [hiveNumber, setHiveNumber] = useState<number | null>(null);

  const [type, setType] = useState<TaskType>('INSPECTION');

  const [priority, setPriority] = useState<TaskPriority>('PRIMARY');

  // 📅 DATE

  const [date, setDate] = useState(Date.now());

  const [dateInput, setDateInput] = useState(
    formatDate(Date.now(), currentLanguage),
  );

  const [showPicker, setShowPicker] = useState(false);

  // 💾 CREATE

  const handleCreate = async () => {
    if (!user) {
      return;
    }

    if (!title.trim() || !hiveNumber) {
      Alert.alert(
        'Error',

        t('taskCreate:validationError'),
      );

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

      Alert.alert(
        'Error',

        t('taskCreate:createError'),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* TITLE */}

        <Text style={styles.title}>➕ {t('taskCreate:title')}</Text>

        {/* TASK TITLE */}

        <Text style={styles.label}>📌 {t('taskCreate:taskName')}</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t('taskCreate:taskPlaceholder')}
        />

        {/* HIVE */}

        <Text style={styles.label}>🐝 {t('tasks:hive')}</Text>

        <HiveSelector
          value={hiveNumber}
          onChange={setHiveNumber}
          hives={hives}
        />

        {/* TYPE */}

        <Text style={styles.label}>📂 {t('taskCreate:type')}</Text>

        <View style={styles.chipContainer}>
          {TASK_TYPES.map((taskType) => {
            const active = type === taskType;

            return (
              <Text
                key={taskType}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setType(taskType)}>
                {getTaskTypeLabel(taskType, t)}
              </Text>
            );
          })}
        </View>

        {/* PRIORITY */}

        <Text style={styles.label}>⚡ {t('tasks:priority')}</Text>

        <View style={styles.chipContainer}>
          {PRIORITIES.map((priorityValue) => {
            const active = priority === priorityValue;

            return (
              <Text
                key={priorityValue}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setPriority(priorityValue)}>
                {getTaskPriorityLabel(priorityValue, t)}
              </Text>
            );
          })}
        </View>

        {/* DATE */}

        <Text style={styles.label}>📅 {t('taskCreate:date')}</Text>

        <View style={styles.dateRow}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            value={dateInput}
            onChangeText={(text) => {
              setDateInput(text);

              const parsed = parseDateUA(text);

              if (parsed) {
                setDate(parsed);
              }
            }}
            placeholder="DD-MM-YYYY"
          />

          <Text style={styles.calendarBtn} onPress={() => setShowPicker(true)}>
            📅
          </Text>
        </View>

        {/* ACTION */}

        <View
          style={{
            marginTop: 24,
          }}>
          <Button
            title={`💾 ${t('taskCreate:create')}`}
            onPress={handleCreate}
          />
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

                setDateInput(formatDate(ts, currentLanguage));
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
