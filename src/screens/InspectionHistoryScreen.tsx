import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';

import {useAuth} from '../auth/AuthProvider';
import {Inspection} from '../types/inspection';
import {loadInspectionsByHive} from '../persistence/inspectionRepository';

export const InspectionHistoryScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;
  const screenWidth = Dimensions.get('window').width;

  const {user} = useAuth();
  const uid = user?.uid;

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      try {
        const data = await loadInspectionsByHive(uid, hiveNumber);
        setInspections(data);
      } catch (e) {
        console.log('❌ LOAD HISTORY ERROR', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, hiveNumber]);
  const prepareChartData = (inspections: Inspection[]) => {
    const sorted = [...inspections].sort((a, b) => a.date - b.date);

    return {
      labels: sorted.map((i) =>
        new Date(i.date).toLocaleDateString().slice(0, 5),
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
      ],
      legend: ['Сила', 'Мед'],
    };
  };

  const chartData = prepareChartData(inspections);

  const renderItem = ({item}: {item: Inspection}) => (
    <View style={styles.card}>
      <Text style={styles.date}>
        📅 {new Date(item.date).toLocaleDateString()}
      </Text>

      <Text>🐝 Сила: {item.strength}</Text>
      <Text>🍯 Мед: {item.honeyKg} кг</Text>
      <Text>👑 Матка: {item.hasQueen ? 'є' : 'немає'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  if (inspections.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Немає оглядів</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Історія вулика {hiveNumber}</Text>

      {/* 🔘 TOGGLE */}
      <View style={styles.toggle}>
        <Text
          style={{fontWeight: mode === 'list' ? 'bold' : 'normal'}}
          onPress={() => setMode('list')}>
          📜 Історія
        </Text>

        <Text
          style={{fontWeight: mode === 'chart' ? 'bold' : 'normal'}}
          onPress={() => setMode('chart')}>
          📊 Графік
        </Text>
      </View>

      {/* 📜 / 📊 CONTENT */}
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
