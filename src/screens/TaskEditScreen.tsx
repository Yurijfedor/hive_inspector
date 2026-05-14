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

import {parseDateUA} from '../utils/date/parseDate';

import {updateTask} from '../domain/useCases/tasks/updateTask';

import {deleteTask} from '../domain/useCases/tasks/deleteTask';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {formatDate} from '../localization/helpers/formatDate';

import {getTaskTypeLabel} from '../localization/helpers/getTaskTypeLabel';

// 🔥 TASK TYPES

const TASK_TYPES: TaskType[] = [
  'FEEDING',
  'INSPECTION',
  'DISEASE',
  'SWARM',
  'SPLIT',
];

export const TaskEditScreen = () => {
  const route = useRoute<any>();

  const navigation = useNavigation<any>();

  const {user} = useAuth();

  const {t, currentLanguage} = useAppTranslation();

  const {task}: {task: Task} = route.params;

  const [title, setTitle] = useState(task.title);

  const [type, setType] = useState<TaskType>(task.type);

  // ✅ COMPLETED

  const [completed, setCompleted] = useState(task.completed);

  // 📅 DATE

  const [date, setDate] = useState(task.date);

  const [dateInput, setDateInput] = useState(
    formatDate(task.date, currentLanguage),
  );

  const [showPicker, setShowPicker] = useState(false);

  // 💾 SAVE

  const handleSave = async () => {
    if (!user) {
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', t('taskEdit:validationError'));

      return;
    }

    try {
      await updateTask(user.uid, {
        ...task,

        title,

        hiveNumber: task.hiveNumber,

        type,

        completed,

        date,
      });

      navigation.goBack();
    } catch (e) {
      console.log('❌ UPDATE FAILED', e);

      Alert.alert('Error', t('taskEdit:saveError'));
    }
  };

  // 🗑 DELETE

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    Alert.alert(
      t('taskEdit:deleteConfirm'),

      t('taskEdit:deleteWarning'),

      [
        {
          text: t('taskEdit:cancel'),

          style: 'cancel',
        },

        {
          text: t('taskEdit:delete'),

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
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* TITLE */}

        <Text style={styles.title}>✏️ {t('taskEdit:title')}</Text>

        {/* HIVE */}

        <Text style={styles.label}>
          🐝 {t('tasks:hive')} #{task.hiveNumber}
        </Text>

        {/* DESCRIPTION */}

        <Text style={styles.label}>📌 {t('taskEdit:taskDescription')}</Text>

        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        {/* TYPE */}

        <Text style={styles.label}>📂 {t('taskEdit:selectType')}</Text>

        <View style={styles.typeContainer}>
          {TASK_TYPES.map((taskType) => {
            const active = type === taskType;

            return (
              <Text
                key={taskType}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setType(taskType)}>
                {getTaskTypeLabel(taskType, t)}
              </Text>
            );
          })}
        </View>

        {/* STATUS */}

        <Text style={styles.label}>✅ {t('taskEdit:status')}</Text>

        <View style={styles.typeContainer}>
          <Text
            style={[styles.typeChip, completed === false && styles.pendingChip]}
            onPress={() => setCompleted(false)}>
            ⏳ {t('taskEdit:pending')}
          </Text>

          <Text
            style={[
              styles.typeChip,

              completed === true && styles.completedChip,
            ]}
            onPress={() => setCompleted(true)}>
            ✅ {t('taskEdit:completed')}
          </Text>
        </View>

        {/* DATE */}

        <Text style={styles.label}>📅 {t('taskEdit:date')}</Text>

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

        {/* ACTIONS */}

        <View
          style={{
            marginTop: 24,
          }}>
          <Button title={`💾 ${t('taskEdit:save')}`} onPress={handleSave} />
        </View>

        <View
          style={{
            marginTop: 10,
          }}>
          <Button
            title={`🗑 ${t('taskEdit:delete')}`}
            color="red"
            onPress={handleDelete}
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

    fontWeight: '700',
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

  // ✅ STATUS

  pendingChip: {
    backgroundColor: '#F57C00',

    color: '#fff',
  },

  completedChip: {
    backgroundColor: '#2E7D32',

    color: '#fff',
  },

  // 📅 DATE

  dateRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,
  },

  calendarBtn: {
    fontSize: 22,

    padding: 8,
  },

  readonlyField: {
    borderWidth: 1,

    borderColor: '#ddd',

    borderRadius: 10,

    padding: 12,

    marginBottom: 12,

    backgroundColor: '#f5f5f5',
  },

  readonlyText: {
    color: '#333',

    fontWeight: '500',
  },
});
