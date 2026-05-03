import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {HiveContext} from '../types/hive';
import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';

export const HiveScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {hiveNumber} = route.params;

  const {user} = useAuth();
  const uid = user?.uid;

  const [context, setContext] = useState<HiveContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      try {
        const contexts = await loadHiveContextsFromFirebase(uid);
        console.log(contexts);

        const hiveCtx = contexts.find((c) => c.hiveNumber === hiveNumber);
        console.log(`foundet hiveCtx : ${JSON.stringify(hiveCtx)}`);

        setContext(hiveCtx ?? null);
      } catch (e) {
        console.log('❌ LOAD HIVE CONTEXT ERROR', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hiveNumber, uid]);

  const handleOpenHistory = () => {
    navigation.navigate('InspectionHistory', {
      hiveNumber,
    });
  };

  const handleManualInspection = () => {
    navigation.navigate('ManualInspection', {
      hiveNumber,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐝 Вулик {hiveNumber}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('TasksList', {
            hiveNumber,
          })
        }>
        <Text style={styles.buttonText}>📅 Завдання</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleManualInspection}>
        <Text style={styles.buttonText}>📝 Ручний огляд</Text>
      </TouchableOpacity>

      {/* 🧠 Стан */}
      <Text style={styles.section}>Стан</Text>

      {context?.lastInspection ? (
        <>
          <Text>Сила: {context.lastInspection.strength}</Text>
          <Text>Розплід: {context.lastInspection.broodFrames}</Text>
          <Text>Мед: {context.lastInspection.honeyKg} кг</Text>
          <Text>
            Матка:{' '}
            {context?.queen?.status === 'present'
              ? `наявна (${context.queen.breed ?? '—'}, ${
                  context.queen.birthYear ?? '—'
                } р.)`
              : context?.queen?.status === 'absent'
              ? 'відсутня'
              : 'невідомо'}
          </Text>
        </>
      ) : (
        <Text>Немає даних</Text>
      )}

      {/* ⚠️ Ознаки */}
      <Text style={styles.section}>Ознаки</Text>

      <Text>
        Роїння: {context?.swarm?.hasSwarmSigns === 'так' ? '⚠️ є' : '✅ немає'}
      </Text>

      <Text>
        Хвороби:{' '}
        {context?.disease?.hasDiseaseSigns === 'так' ? '⚠️ є' : '✅ немає'}
      </Text>

      {/* 🕵️ Останній огляд */}
      <Text style={styles.section}>Останній огляд</Text>

      {context?.lastInspection ? (
        <Text>
          {new Date(context.lastInspection.date).toLocaleDateString()}
        </Text>
      ) : (
        <Text>Немає даних</Text>
      )}

      {/* 📜 КНОПКА ІСТОРІЇ */}
      <TouchableOpacity style={styles.button} onPress={handleOpenHistory}>
        <Text style={styles.buttonText}>📜 Історія</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },

  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },

  button: {
    marginTop: 25,
    padding: 12,
    backgroundColor: '#02d413',
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
