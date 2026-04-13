import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../auth/AuthProvider';
import {getApiarySummary} from '../services/apiaryService';
import {ApiarySummary} from '../domain/apiary';
import {
  buildApiaryDynamics,
  getApiaryStatus,
} from '../services/analytics/apiaryAnalytics';
import {loadInspections} from '../persistence/inspectionRepository';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ApiaryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {user} = useAuth();
  const uid = user?.uid;

  const screenWidth = Dimensions.get('window').width;

  const [summary, setSummary] = useState<ApiarySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [status, setStatus] = useState<'good' | 'warning' | 'critical'>('good');

  // 📊 SUMMARY
  const load = useCallback(async () => {
    if (!uid) return;

    try {
      setLoading(true);
      const data = await getApiarySummary(uid);
      setSummary(data);
    } catch (e) {
      console.log('❌ LOAD APIARY SUMMARY FAILED', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  // 📈 ANALYTICS
  const loadAnalytics = useCallback(async () => {
    if (!uid) return;

    try {
      const inspections = await loadInspections(uid);
      const points = buildApiaryDynamics(inspections);

      if (points.length === 0) return;

      const chart = {
        labels: points.map((p) => p.date.slice(0, 5)),
        datasets: [
          {
            data: points.map((p) => p.avgStrength),
            color: () => '#4CAF50',
            strokeWidth: 2,
          },
          {
            data: points.map((p) => p.avgHoney),
            color: () => '#FFC107',
            strokeWidth: 2,
          },
        ],
        legend: ['Сила', 'Мед'],
      };

      setChartData(chart);
      setStatus(getApiaryStatus(points));
    } catch (e) {
      console.log('❌ ANALYTICS ERROR', e);
    }
  }, [uid]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // ⏳ LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.center}>
        <Text>Немає даних</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🐝 Пасіка</Text>

      {/* 📊 SUMMARY */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() =>
            navigation.navigate('ApiaryCategory', {category: 'ALL'})
          }>
          <SummaryCard label="Вулики" value={summary.totalHives} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() =>
            navigation.navigate('ApiaryCategory', {
              category: 'NO_INSPECTION',
            })
          }>
          <SummaryCard label="Без огляду" value={summary.noInspectionCount} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() =>
            navigation.navigate('ApiaryCategory', {category: 'FEEDING'})
          }>
          <SummaryCard label="Підгодівля" value={summary.needsFeedingCount} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() =>
            navigation.navigate('ApiaryCategory', {category: 'PROBLEMS'})
          }>
          <SummaryCard label="Проблеми" value={summary.problemHivesCount} />
        </TouchableOpacity>
      </View>

      {/* 🎤 VOICE */}
      <TouchableOpacity style={styles.voiceButton}>
        <Text style={styles.voiceText}>🎤 Почати огляд</Text>
      </TouchableOpacity>

      {/* 🟢 STATUS */}
      <View
        style={[
          styles.statusBox,
          status === 'good' && styles.statusGood,
          status === 'warning' && styles.statusWarning,
          status === 'critical' && styles.statusCritical,
        ]}>
        <Text style={styles.statusText}>
          {status === 'good' && '🟢 Пасіка в хорошому стані'}
          {status === 'warning' && '🟡 Потрібна увага'}
          {status === 'critical' && '🔴 Критичний стан'}
        </Text>
      </View>

      {/* 📊 CHART */}
      {chartData && (
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
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
};

function SummaryCard({label, value}: {label: string; value: number}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    flexGrow: 1, // 🔥 важливо для scroll
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },

  cardValue: {
    fontSize: 22,
    fontWeight: '700',
  },

  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  voiceButton: {
    marginTop: 20,
    marginBottom: 12,
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  voiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  statusBox: {
    marginTop: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },

  statusGood: {
    backgroundColor: '#e8f5e9',
  },

  statusWarning: {
    backgroundColor: '#fff8e1',
  },

  statusCritical: {
    backgroundColor: '#ffebee',
  },

  chart: {
    marginTop: 8,
    borderRadius: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
