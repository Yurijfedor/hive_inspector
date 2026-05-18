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

import {InfoRow} from '../components/common/InfoRow';
import {SectionTitle} from '../components/common/SectionTitle';

import {formatDate} from '../localization/helpers/formatDate';
import {getQueenSummary} from '../localization/helpers/getQueenSummary';
import {getInspectionMetricsSummary} from '../localization/helpers/getInspectionMetricsSummary';
import {getSwarmSummary} from '../localization/helpers/getSwarmSummary';
import {getDiseaseSummary} from '../localization/helpers/getDiseaseSummary';

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

      <SectionTitle>{t('hive:sections.status')}</SectionTitle>

      {context?.lastInspection ? (
        <>
          {getInspectionMetricsSummary(context.lastInspection, t).map(
            (metric) => (
              <InfoRow
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ),
          )}

          <Text>
            {t('hive:fields.queen')}: {getQueenSummary(context?.queen, t)}
          </Text>
        </>
      ) : (
        <Text>{t('hive:empty.noData')}</Text>
      )}

      {/* SIGNS */}

      <SectionTitle>{t('hive:sections.signs')}</SectionTitle>

      <Text>
        {t('hive:fields.swarm')}: {getSwarmSummary(context?.swarm, t)}
      </Text>

      <Text>
        {t('hive:fields.disease')}: {getDiseaseSummary(context?.disease, t)}
      </Text>

      {/* LAST INSPECTION */}

      <SectionTitle>{t('hive:sections.lastInspection')}</SectionTitle>

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

  // section: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   marginTop: 16,
  //   marginBottom: 4,
  // },

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
