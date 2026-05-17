import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';

import {useRoute} from '@react-navigation/native';

import {LineChart} from 'react-native-chart-kit';

import {useAuth} from '../auth/AuthProvider';

import {Inspection} from '../types/inspection';

import {loadInspectionsByHive} from '../persistence/inspectionRepository';

import {useAppTranslation} from '../hooks/useAppTranslation';

import {formatDate} from '../localization/helpers/formatDate';

import {getQueenSummary} from '../localization/helpers/getQueenSummary';

import {getInspectionMetricsSummary} from '../localization/helpers/getInspectionMetricsSummary';

export const InspectionHistoryScreen = () => {
  const route = useRoute<any>();

  const {hiveNumber} = route.params;

  const screenWidth = Dimensions.get('window').width;

  const {user} = useAuth();

  const uid = user?.uid;

  const {t, currentLanguage} = useAppTranslation();

  const [inspections, setInspections] = useState<Inspection[]>([]);

  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    if (!uid) {
      return;
    }

    const load = async () => {
      try {
        const data = await loadInspectionsByHive(uid, hiveNumber);

        console.log(data);

        setInspections(data);
      } catch (e) {
        console.log('❌ LOAD HISTORY ERROR', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, hiveNumber]);

  const prepareChartData = (inspectionData: Inspection[]) => {
    const sorted = [...inspectionData].sort((a, b) => a.date - b.date);

    return {
      labels: sorted.map((i) =>
        formatDate(i.date, currentLanguage).slice(0, 5),
      ),

      datasets: [
        {
          data: sorted.map((i) => i.strength ?? 0),

          color: () => '#4CAF50',

          strokeWidth: 2,
        },

        {
          data: sorted.map((i) => i.honeyKg ?? 0),

          color: () => '#FFC107',

          strokeWidth: 2,
        },

        {
          data: sorted.map((i) => i.broodFrames ?? 0),

          color: () => '#9C27B0',

          strokeWidth: 2,
        },
      ],

      legend: [
        t('inspectionHistory:chart.strength'),

        t('inspectionHistory:chart.honey'),

        t('inspectionHistory:chart.brood'),
      ],
    };
  };

  const chartData = prepareChartData(inspections);

  const renderItem = ({item}: {item: Inspection}) => (
    <View style={styles.card}>
      {/* DATE */}

      <Text style={styles.date}>
        📅 {formatDate(item.date, currentLanguage)}
      </Text>

      {/* METRICS */}

      {getInspectionMetricsSummary(item, t).map((metric) => (
        <Text key={metric.label}>
          {metric.label}: {metric.value}
        </Text>
      ))}

      {/* QUEEN */}

      <Text>
        👑 {t('inspectionHistory:fields.queen')}:{' '}
        {typeof item.queen === 'object'
          ? getQueenSummary(
              {
                status:
                  item.queen.present === true
                    ? 'present'
                    : item.queen.present === false
                    ? 'absent'
                    : 'unknown',
              },
              t,
            )
          : item.queen}
      </Text>
    </View>
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{t('inspectionHistory:loading')}</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------

  if (inspections.length === 0) {
    return (
      <View style={styles.container}>
        <Text>{t('inspectionHistory:empty.noInspections')}</Text>
      </View>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      {/* TITLE */}

      <Text style={styles.title}>
        📜{' '}
        {t('inspectionHistory:title', {
          hiveNumber,
        })}
      </Text>

      {/* TOGGLE */}

      <View style={styles.toggle}>
        <Text
          style={{
            fontWeight: mode === 'list' ? 'bold' : 'normal',
          }}
          onPress={() => setMode('list')}>
          📜 {t('inspectionHistory:modes.history')}
        </Text>

        <Text
          style={{
            fontWeight: mode === 'chart' ? 'bold' : 'normal',
          }}
          onPress={() => setMode('chart')}>
          📊 {t('inspectionHistory:modes.chart')}
        </Text>
      </View>

      {/* CONTENT */}

      {mode === 'list' ? (
        <FlatList
          data={inspections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',

            backgroundGradientTo: '#fff',

            decimalPlaces: 0,

            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          bezier
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
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },

  date: {
    fontWeight: '600',
    marginBottom: 4,
  },

  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
});
