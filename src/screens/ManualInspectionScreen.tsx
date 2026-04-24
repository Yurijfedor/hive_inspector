import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useConversation} from '../conversation/ConversationProvider';
import {runInspectionBatch} from '../features/manualInput/runInspectionBatch';

type Tab = 'main' | 'swarm' | 'disease' | 'split';

export const ManualInspectionScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;

  const driver = useConversation();

  const [activeTab, setActiveTab] = useState<Tab>('main');

  const [form, setForm] = useState({
    strength: '10',
    broodFrames: '5',
    honeyKg: '20',
    queen: true,
    queenBreed: 'карніка',
    queenYear: '2024',

    // 🔸 майбутні поля
    swarm: false,
    disease: '',
    split: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  const handleSave = async () => {
    console.log('🔥 CLICK SAVE');

    try {
      await runInspectionBatch(driver, hiveNumber, {
        strength: Number(form.strength),
        broodFrames: Number(form.broodFrames),
        honeyKg: Number(form.honeyKg),
        queen: form.queen ? 'так' : 'ні',
        queenBreed: form.queenBreed,
        queenYear: Number(form.queenYear),
      });
    } catch (e) {
      console.log('❌ SAVE ERROR', e);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'main':
        return (
          <>
            <Text style={styles.section}>Основні дані</Text>

            <Text>Сила</Text>
            <TextInput
              value={form.strength}
              onChangeText={(v) => handleChange('strength', v)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Розплід</Text>
            <TextInput
              value={form.broodFrames}
              onChangeText={(v) => handleChange('broodFrames', v)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Мед</Text>
            <TextInput
              value={form.honeyKg}
              onChangeText={(v) => handleChange('honeyKg', v)}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.section}>Матка</Text>

            <View style={styles.row}>
              <Text>Є матка</Text>
              <Switch
                value={form.queen}
                onValueChange={(v) => handleChange('queen', v)}
              />
            </View>

            {form.queen && (
              <>
                <Text>Порода</Text>
                <TextInput
                  value={form.queenBreed}
                  onChangeText={(v) => handleChange('queenBreed', v)}
                  style={styles.input}
                />

                <Text>Рік</Text>
                <TextInput
                  value={form.queenYear}
                  onChangeText={(v) => handleChange('queenYear', v)}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </>
            )}
          </>
        );

      case 'swarm':
        return (
          <>
            <Text style={styles.section}>Роїння</Text>

            <View style={styles.row}>
              <Text>Було роїння</Text>
              <Switch
                value={form.swarm}
                onValueChange={(v) => handleChange('swarm', v)}
              />
            </View>
          </>
        );

      case 'disease':
        return (
          <>
            <Text style={styles.section}>Хвороби</Text>

            <Text>Опис</Text>
            <TextInput
              value={form.disease}
              onChangeText={(v) => handleChange('disease', v)}
              style={styles.input}
            />
          </>
        );

      case 'split':
        return (
          <>
            <Text style={styles.section}>Відводки</Text>

            <View style={styles.row}>
              <Text>Зроблено відводок</Text>
              <Switch
                value={form.split}
                onValueChange={(v) => handleChange('split', v)}
              />
            </View>
          </>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* 🔵 Tabs */}
      <View style={styles.tabs}>
        <TabButton
          label="Огляд"
          active={activeTab === 'main'}
          onPress={() => setActiveTab('main')}
        />
        <TabButton
          label="Роїння"
          active={activeTab === 'swarm'}
          onPress={() => setActiveTab('swarm')}
        />
        <TabButton
          label="Хвороби"
          active={activeTab === 'disease'}
          onPress={() => setActiveTab('disease')}
        />
        <TabButton
          label="Відводки"
          active={activeTab === 'split'}
          onPress={() => setActiveTab('split')}
        />
      </View>

      <ScrollView contentContainerStyle={{padding: 16}}>
        <Text style={styles.title}>Вулик №{hiveNumber}</Text>

        {renderTab()}

        <View style={{marginTop: 24}}>
          <Button title="Зберегти" onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
};

const TabButton = ({label, active, onPress}: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.tabActive]}>
    <Text style={{color: active ? '#fff' : '#000'}}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  section: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tab: {
    padding: 8,
  },
  tabActive: {
    backgroundColor: '#333',
    borderRadius: 6,
  },
});
