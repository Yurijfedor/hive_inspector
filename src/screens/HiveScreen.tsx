import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {HiveContext} from '../types/hive';
import {loadHiveContexts} from '../persistence/inspectionRepository';

export const HiveScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;

  const [context, setContext] = useState<HiveContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        const contexts = await loadHiveContexts(uid);

        const hiveCtx = contexts.find((c) => c.hiveNumber === hiveNumber);

        setContext(hiveCtx ?? null);
      } catch (e) {
        console.log('❌ LOAD HIVE CONTEXT ERROR', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [hiveNumber]);

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

      {/* 🧠 Стан */}
      <Text style={styles.section}>Стан</Text>

      {context?.lastInspection ? (
        <>
          <Text>Сила: {context.lastInspection.strength}</Text>
          <Text>Мед: {context.lastInspection.honeyKg} кг</Text>
          <Text>Матка: {context.lastInspection.hasQueen ? 'є' : 'немає'}</Text>
        </>
      ) : (
        <Text>Немає даних</Text>
      )}

      {/* ⚠️ Ознаки */}
      <Text style={styles.section}>Ознаки</Text>

      <Text>Роїння: {context?.swarm?.hasSwarmSigns ? '⚠️ є' : '✅ немає'}</Text>

      <Text>
        Хвороби: {context?.disease?.hasDiseaseSigns ? '⚠️ є' : '✅ немає'}
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

      {/* 📋 META */}
      <Text style={styles.section}>Метадані</Text>

      <Text>Остання сила: {context?.meta?.lastStrength ?? '—'}</Text>

      <Text>Підгодівля: {context?.feeding?.hasFeeding ? 'є' : 'немає'}</Text>
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
});
