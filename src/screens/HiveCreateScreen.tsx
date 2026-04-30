import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {createHive} from '../domain/useCases/hives/createHive';

export const HiveCreateScreen = () => {
  const navigation = useNavigation<any>();
  const {user} = useAuth();

  const [hiveNumber, setHiveNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // 🐝 CREATE HIVE
  // --------------------------------------------------

  const handleCreate = async () => {
    if (!user) return;

    const number = Number(hiveNumber);

    // 🔒 VALIDATION
    if (!hiveNumber || isNaN(number)) {
      Alert.alert('Помилка', 'Введи коректний номер вулика');
      return;
    }

    if (number <= 0) {
      Alert.alert('Помилка', 'Номер має бути більше 0');
      return;
    }

    try {
      setLoading(true);

      await createHive(user.uid, number);

      console.log('✅ HIVE CREATED:', number);

      // 👉 UX: одразу відкриваємо вулик
      navigation.replace('Hive', {hiveNumber: number});
    } catch (e: any) {
      console.log('❌ CREATE HIVE FAILED', e);

      if (e.message === 'Hive already exists') {
        Alert.alert('Помилка', 'Такий вулик вже існує');
      } else {
        Alert.alert('Помилка', 'Не вдалося створити вулик');
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>➕ Додати вулик</Text>

        {/* INPUT */}
        <Text style={styles.label}>🐝 Номер вулика</Text>

        <TextInput
          style={styles.input}
          value={hiveNumber}
          onChangeText={setHiveNumber}
          keyboardType="numeric"
          placeholder="Наприклад: 12"
        />

        {/* INFO */}
        <Text style={styles.hint}>
          Після створення можна одразу додати огляд або задачі
        </Text>

        {/* BUTTON */}
        <View style={{marginTop: 20}}>
          <Button
            title={loading ? '⏳ Створення...' : '💾 Створити'}
            onPress={handleCreate}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --------------------------------------------------
// 🎨 STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },

  hint: {
    marginTop: 10,
    color: '#666',
    fontSize: 13,
  },
});
