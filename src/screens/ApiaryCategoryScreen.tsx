import React, {useEffect, useState, useCallback} from 'react';

import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';

import {useAuth} from '../auth/AuthProvider';

import {TaskRepository} from '../domain/repositories/taskRepository';

import {HiveContextRepository} from '../domain/repositories/hiveContextRepository';

import {loadInspections} from '../persistence/inspectionRepository';

import {ApiaryCategory} from '../domain/apiary';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {getApiaryCategoryLabel} from '../localization/helpers/getApiaryCategoryLabel';

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

  const {t} = useAppTranslation();

  const [hives, setHives] = useState<number[]>([]);

  // --------------------------------------------------
  // LOAD
  // --------------------------------------------------

  const load = useCallback(async () => {
    if (!uid) {
      return;
    }

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

  // --------------------------------------------------
  // EFFECTS
  // --------------------------------------------------

  useEffect(() => {
    load();
  }, [load]);

  console.log(hives);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      {/* TITLE */}

      <Text style={styles.title}>
        🐝 {getApiaryCategoryLabel(route.params.category, t)}
      </Text>

      {/* EMPTY */}

      {hives.length === 0 && (
        <Text style={styles.empty}>{t('apiary:empty.noHives')}</Text>
      )}

      {/* HIVES */}

      <FlatList
        data={hives}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Hive', {
                hiveNumber: item,
              })
            }>
            <Text style={styles.hiveNumber}>
              🐝 {t('apiary:hive')} {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,

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

  // 🐝 hive card

  card: {
    backgroundColor: '#f5f5f5',

    padding: 16,

    borderRadius: 12,

    marginBottom: 12,

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 6,

    elevation: 2,
  },

  // 🔢 hive number

  hiveNumber: {
    fontSize: 18,

    fontWeight: '700',

    marginBottom: 4,
  },

  // 🧠 meta

  meta: {
    fontSize: 14,

    color: '#666',
  },

  // ❌ empty

  empty: {
    marginTop: 40,

    textAlign: 'center',

    fontSize: 16,

    color: '#999',
  },

  list: {
    paddingBottom: 24,
  },
});
