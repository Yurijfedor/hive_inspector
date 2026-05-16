import React, {useState, useCallback} from 'react';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {
  useRoute,
  useNavigation,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAuth} from '../auth/AuthProvider';

import {HiveContext} from '../types/hive';

import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';

import {RootStackParamList} from '../navigation/types';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {formatDate} from '../localization/helpers/formatDate';

import {getQueenStatusLabel} from '../localization/helpers/getQueenStatusLabel';

import {getBooleanSignLabel} from '../localization/helpers/getBooleanSignLabel';

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type HiveScreenRouteProp = RouteProp<RootStackParamList, 'Hive'>;

type HiveScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --------------------------------------------------
// SCREEN
// --------------------------------------------------

export const HiveScreen = () => {
  const route = useRoute<HiveScreenRouteProp>();

  const navigation = useNavigation<HiveScreenNavigationProp>();

  const {hiveNumber} = route.params;

  const {user} = useAuth();

  const uid = user?.uid;

  const {t, currentLanguage} = useAppTranslation();

  const [context, setContext] = useState<HiveContext | null>(null);

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD HIVE
  // --------------------------------------------------

  const loadHive = useCallback(async () => {
    if (!uid) {
      return;
    }

    try {
      setLoading(true);

      const contexts = await loadHiveContextsFromFirebase(uid);

      console.log('📦 HIVE CONTEXTS:', contexts);

      const hiveCtx = contexts.find((c) => c.hiveNumber === hiveNumber);

      console.log(`🐝 FOUND HIVE CONTEXT: ${JSON.stringify(hiveCtx)}`);

      setContext(hiveCtx ?? null);
    } catch (e) {
      console.log('❌ LOAD HIVE CONTEXT ERROR', e);
    } finally {
      setLoading(false);
    }
  }, [hiveNumber, uid]);

  // --------------------------------------------------
  // AUTO REFRESH ON SCREEN FOCUS
  // --------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      loadHive();
    }, [loadHive]),
  );

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

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

  const handleOpenTasks = () => {
    navigation.navigate('TasksList', {
      hiveNumber,
    });
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{t('hive:loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TITLE */}

      <Text style={styles.title}>🐝 {t('hive:title', {hiveNumber})}</Text>

      {/* ACTIONS */}

      <TouchableOpacity style={styles.button} onPress={handleOpenTasks}>
        <Text style={styles.buttonText}>📅 {t('hive:actions.tasks')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleManualInspection}>
        <Text style={styles.buttonText}>
          📝 {t('hive:actions.manualInspection')}
        </Text>
      </TouchableOpacity>

      {/* STATUS */}

      <Text style={styles.section}>{t('hive:sections.status')}</Text>

      {context?.lastInspection ? (
        <>
          <Text>
            {t('hive:fields.strength')}:{' '}
            {context.lastInspection.strength ?? '—'}
          </Text>

          <Text>
            {t('hive:fields.brood')}:{' '}
            {context.lastInspection.broodFrames ?? '—'}
          </Text>

          <Text>
            {t('hive:fields.honey')}: {context.lastInspection.honeyKg ?? '—'} кг
          </Text>

          <Text>
            {t('hive:fields.queen')}:{' '}
            {context?.queen?.status === 'present'
              ? `${getQueenStatusLabel(context.queen.status, t)} (${
                  context.queen.breed ?? '—'
                }, ${context.queen.birthYear ?? '—'})`
              : getQueenStatusLabel(context?.queen?.status, t)}
          </Text>
        </>
      ) : (
        <Text>{t('hive:empty.noData')}</Text>
      )}

      {/* SIGNS */}

      <Text style={styles.section}>{t('hive:sections.signs')}</Text>

      <Text>
        {t('hive:fields.swarm')}:{' '}
        {getBooleanSignLabel(context?.swarm?.hasSwarmSigns === 'так', t)}
      </Text>

      <Text>
        {t('hive:fields.disease')}:{' '}
        {getBooleanSignLabel(context?.disease?.hasDiseaseSigns === 'так', t)}
      </Text>

      {/* LAST INSPECTION */}

      <Text style={styles.section}>{t('hive:sections.lastInspection')}</Text>

      {context?.lastInspection ? (
        <Text>{formatDate(context.lastInspection.date, currentLanguage)}</Text>
      ) : (
        <Text>{t('hive:empty.noData')}</Text>
      )}

      {/* HISTORY */}

      <TouchableOpacity style={styles.button} onPress={handleOpenHistory}>
        <Text style={styles.buttonText}>📜 {t('hive:actions.history')}</Text>
      </TouchableOpacity>
    </View>
  );
};

// --------------------------------------------------
// STYLES
// --------------------------------------------------

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
