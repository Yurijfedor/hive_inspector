import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../auth/AuthProvider';
import {TaskRepository} from '../domain/repositories/taskRepository';
import {HiveContextRepository} from '../domain/repositories/hiveContextRepository';
import {loadInspections} from '../persistence/inspectionRepository';
import {ApiaryCategory} from '../domain/apiary';

type RouteParams = {
  ApiaryCategory: {
    category: ApiaryCategory;
  };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ApiaryCategory'
>;

export const ApiaryCategoryScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'ApiaryCategory'>>();
  const navigation = useNavigation<NavigationProp>();

  const {user} = useAuth();
  const uid = user?.uid;

  const [hives, setHives] = useState<number[]>([]);

  const load = useCallback(async () => {
    if (!uid) return;

    const taskRepo = new TaskRepository();
    const ctxRepo = new HiveContextRepository();

    const tasks = await taskRepo.getAll();
    const inspections = await loadInspections(uid);
    const hiveNumbers = Array.from(new Set(tasks.map((t) => t.hiveNumber)));

    const result: number[] = [];

    for (const hiveNumber of hiveNumbers) {
      const ctx = ctxRepo.buildFromData(hiveNumber, tasks, inspections);
      console.log(ctx);

      switch (route.params.category) {
        case 'ALL':
          result.push(hiveNumber);
          break;

        case 'NO_INSPECTION': {
          const now = Date.now();
          const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

          if (
            !ctx.lastInspection?.date ||
            now - ctx.lastInspection.date > SEVEN_DAYS
          ) {
            result.push(hiveNumber);
          }

          break;
        }

        case 'FEEDING': {
          const strength = ctx.lastInspection?.strength ?? 0;
          const honey = ctx.lastInspection?.honeyKg ?? 0;

          const needsFeeding = strength > 0 && honey < strength * 1.5;

          if (needsFeeding) {
            result.push(hiveNumber);
          }

          break;
        }
        case 'PROBLEMS': {
          const now = Date.now();
          const RECENT_DAYS = 3 * 24 * 60 * 60 * 1000;

          const hasRecentDisease =
            ctx.disease?.lastDiseaseCheck &&
            now - ctx.disease.lastDiseaseCheck < RECENT_DAYS;

          const hasRecentSwarm =
            ctx.swarm?.lastSwarmCheck &&
            now - ctx.swarm.lastSwarmCheck < RECENT_DAYS;

          if (hasRecentDisease || hasRecentSwarm) {
            result.push(hiveNumber);
          }

          break;
        }
      }
    }

    setHives(result);
  }, [uid, route.params.category]);

  useEffect(() => {
    load();
  }, [load]);
  console.log(hives);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐝 Вулики</Text>

      {hives.map((hive) => (
        <TouchableOpacity
          key={hive}
          onPress={() => navigation.navigate('Hive', {hiveNumber: hive})}>
          <Text style={styles.item}>Вулик {hive}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  item: {
    fontSize: 16,
    fontWeight: '500',
  },

  // 🐝 карточка вулика
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,

    // легка тінь
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // 🔢 номер вулика
  hiveNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  // 🧠 мета інформація
  meta: {
    fontSize: 14,
    color: '#666',
  },

  // ❌ пустий стан
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});
