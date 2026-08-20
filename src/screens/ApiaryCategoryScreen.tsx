import React, {useCallback, useEffect, useState} from 'react';

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';

import {useAuth} from '../auth/AuthProvider';

import {TaskRepository} from '../domain/repositories/taskRepository';

import {HiveRepository} from '../persistence/hiveRepository';

import {HiveContextRepository} from '../persistence/hiveContextRepository';

import {ApiaryCategory} from '../domain/apiary';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {getApiaryCategoryLabel} from '../localization/helpers/getApiaryCategoryLabel';

import {RefreshableFlatList} from '../components/common/RefreshableFlatList';
import {refreshAppData} from '../refresh/refreshAppData';

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type RouteParams = {
  ApiaryCategory: {
    category: ApiaryCategory;
  };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ApiaryCategory'
>;

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

const RECENT_DAYS = 3 * 24 * 60 * 60 * 1000;

// --------------------------------------------------
// SCREEN
// --------------------------------------------------

export const ApiaryCategoryScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'ApiaryCategory'>>();

  const navigation = useNavigation<NavigationProp>();

  const {user} = useAuth();

  const {t} = useAppTranslation();

  const [hives, setHives] = useState<number[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD CATEGORY
  // --------------------------------------------------

  const load = useCallback(async () => {
    try {
      setLoading(true);

      // --------------------------------------------------
      // 1. LOCAL REPOSITORIES
      // --------------------------------------------------

      const hiveRepository = new HiveRepository();

      const taskRepository = new TaskRepository();

      const hiveContextRepository = new HiveContextRepository();

      // --------------------------------------------------
      // 2. LOAD LOCAL DATA
      // --------------------------------------------------

      const [localHives, tasks, contexts] = await Promise.all([
        hiveRepository.getAll(),
        taskRepository.getAll(),
        hiveContextRepository.loadAll(),
      ]);

      console.log('📂 LOCAL HIVES:', localHives);
      console.log('📂 LOCAL TASKS:', tasks.length);
      console.log('📂 LOCAL CONTEXTS:', contexts.length);

      // --------------------------------------------------
      // 3. BUILD COMPLETE HIVE NUMBER SET
      // --------------------------------------------------

      const hiveNumbers = new Set<number>();

      // Основне джерело — реально створені вулики
      for (const hive of localHives) {
        if (
          typeof hive.hiveNumber === 'number' &&
          Number.isFinite(hive.hiveNumber)
        ) {
          hiveNumbers.add(hive.hiveNumber);
        }
      }

      // Додаткове джерело — задачі
      for (const task of tasks) {
        if (
          typeof task.hiveNumber === 'number' &&
          Number.isFinite(task.hiveNumber)
        ) {
          hiveNumbers.add(task.hiveNumber);
        }
      }

      // Додаткове джерело — synced contexts
      for (const context of contexts) {
        if (
          typeof context.hiveNumber === 'number' &&
          Number.isFinite(context.hiveNumber)
        ) {
          hiveNumbers.add(context.hiveNumber);
        }
      }

      const allHiveNumbers = Array.from(hiveNumbers);

      console.log(
        '🐝 ALL KNOWN HIVES:',
        allHiveNumbers.sort((a, b) => a - b),
      );

      // --------------------------------------------------
      // 4. BUILD CATEGORY
      // --------------------------------------------------

      const result: number[] = [];

      const now = Date.now();

      for (const hiveNumber of allHiveNumbers) {
        const context = contexts.find((item) => item.hiveNumber === hiveNumber);

        // ------------------------------------------------
        // ALL
        // ------------------------------------------------

        if (route.params.category === 'ALL') {
          result.push(hiveNumber);
          continue;
        }

        // ------------------------------------------------
        // NO INSPECTION
        // ------------------------------------------------

        if (route.params.category === 'NO_INSPECTION') {
          const lastInspectionDate = context?.lastInspection?.date;

          if (!lastInspectionDate || now - lastInspectionDate > SEVEN_DAYS) {
            result.push(hiveNumber);
          }

          continue;
        }

        // ------------------------------------------------
        // FEEDING
        // ------------------------------------------------

        if (route.params.category === 'FEEDING') {
          const inspection = context?.lastInspection;

          if (!inspection) {
            continue;
          }

          const strength = inspection.strength ?? 0;

          const honey = inspection.honeyKg ?? 0;

          const needsFeeding = strength > 0 && honey < strength * 1.5;

          if (needsFeeding) {
            result.push(hiveNumber);
          }

          continue;
        }

        // ------------------------------------------------
        // PROBLEMS
        // ------------------------------------------------

        if (route.params.category === 'PROBLEMS') {
          const diseaseUpdatedAt = context?.disease?.updatedAt;

          const swarmUpdatedAt = context?.swarm?.updatedAt;

          const hasRecentDisease =
            typeof diseaseUpdatedAt === 'number' &&
            now - diseaseUpdatedAt < RECENT_DAYS;

          const hasRecentSwarm =
            typeof swarmUpdatedAt === 'number' &&
            now - swarmUpdatedAt < RECENT_DAYS;

          if (hasRecentDisease || hasRecentSwarm) {
            result.push(hiveNumber);
          }

          continue;
        }
      }

      // --------------------------------------------------
      // 5. SORT
      // --------------------------------------------------

      result.sort((a, b) => a - b);

      console.log(`✅ CATEGORY ${route.params.category}:`, result);

      setHives(result);
    } catch (error) {
      console.log('❌ CATEGORY LOAD ERROR:', error);

      setHives([]);
    } finally {
      setLoading(false);
    }
  }, [route.params.category]);

  // --------------------------------------------------
  // LOAD ON SCREEN OPEN
  // --------------------------------------------------

  const handleRefresh = useCallback(async () => {
    console.log('🔄 SWIPE REFRESH TRIGGERED');

    if (!user?.uid) {
      console.log('❌ NO USER UID');
      return;
    }

    setRefreshing(true);

    try {
      console.log('🔄 CALL refreshAppData');

      await refreshAppData(user.uid);

      console.log('🔄 RELOAD LOCAL DATA');

      await load();

      console.log('✅ SWIPE REFRESH DONE');
    } catch (e) {
      console.log('❌ APP REFRESH FAILED:', e);
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid, load]);

  useEffect(() => {
    load();
  }, [load]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      {/* TITLE */}

      <Text style={styles.title}>
        🐝 {getApiaryCategoryLabel(route.params.category, t)}
      </Text>

      {/* LOADING */}

      {!loading && (
        <RefreshableFlatList
          data={hives}
          keyExtractor={(item) => item.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          // onRefresh={() => {
          //   console.log('🔥🔥🔥 REFRESH CONTROL WORKS');
          // }}
          contentContainerStyle={[
            styles.list,
            hives.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={
            <Text style={styles.empty}>{t('apiary:empty.noHives')}</Text>
          }
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
      )}
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

  hiveNumber: {
    fontSize: 18,
    fontWeight: '700',
  },

  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },

  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
