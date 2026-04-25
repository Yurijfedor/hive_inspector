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

// import {useConversation} from '../conversation/ConversationProvider';

// ❗ НОВЕ
import {runManualBatch} from '../application/runManualBatch';
import {normalizeManualForm} from '../features/manualInput/mappers/normalizeManualForm';

type Tab = 'main' | 'swarm' | 'disease' | 'split';

export const ManualInspectionScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;

  // const driver = useConversation();

  const [activeTab, setActiveTab] = useState<Tab>('main');

  const [form, setForm] = useState({
    inspection: {
      strength: '10',
      broodFrames: '5',
      honeyKg: '20',
      queen: true,
      queenBreed: 'карніка',
      queenYear: '2024',
    },

    swarm: {
      queenEmergence: false,
      sealedCells: false,
      openCells: false,
      eggsInCells: false,
    },

    disease: {
      diarrhea: false,
      deformedWings: false,
      mitesVisible: false,
      weakBrood: false,
    },

    split: {
      isSplit: false,
      usedForSplits: false,
      broodFrames: '0',
      foodFrames: '0',
    },
  });

  const handleChange = (
    section: keyof typeof form,
    key: string,
    value: any,
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // 🔥 ПОВНІСТЮ НОВА ЛОГІКА
  const handleSave = async () => {
    console.log('🔥 CLICK SAVE');

    try {
      // 1. нормалізація (boolean → "так/ні", string → number)
      const normalized = normalizeManualForm(form);

      console.log('🧾 NORMALIZED FORM', normalized);

      // 2. прямий виклик domain (без flow)
      await runManualBatch(hiveNumber, normalized);

      console.log('✅ ALL DATA SAVED');
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
              value={form.inspection.strength}
              onChangeText={(v: string) =>
                handleChange('inspection', 'strength', v)
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Розплід</Text>
            <TextInput
              value={form.inspection.broodFrames}
              onChangeText={(v: string) =>
                handleChange('inspection', 'broodFrames', v)
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Мед</Text>
            <TextInput
              value={form.inspection.honeyKg}
              onChangeText={(v: string) =>
                handleChange('inspection', 'honeyKg', v)
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.section}>Матка</Text>

            <View style={styles.row}>
              <Text>Є матка</Text>
              <Switch
                value={form.inspection.queen}
                onValueChange={(v: boolean) =>
                  handleChange('inspection', 'queen', v)
                }
              />
            </View>

            {form.inspection.queen && (
              <>
                <Text>Порода</Text>
                <TextInput
                  value={form.inspection.queenBreed}
                  onChangeText={(v: string) =>
                    handleChange('inspection', 'queenBreed', v)
                  }
                  style={styles.input}
                />

                <Text>Рік</Text>
                <TextInput
                  value={form.inspection.queenYear}
                  onChangeText={(v: string) =>
                    handleChange('inspection', 'queenYear', v)
                  }
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

            <SwitchRow
              label="Вихід маток"
              value={form.swarm.queenEmergence}
              onChange={(v) => handleChange('swarm', 'queenEmergence', v)}
            />

            <SwitchRow
              label="Печатні маточники"
              value={form.swarm.sealedCells}
              onChange={(v) => handleChange('swarm', 'sealedCells', v)}
            />

            <SwitchRow
              label="Відкриті маточники"
              value={form.swarm.openCells}
              onChange={(v) => handleChange('swarm', 'openCells', v)}
            />

            <SwitchRow
              label="Яйця в маточниках"
              value={form.swarm.eggsInCells}
              onChange={(v) => handleChange('swarm', 'eggsInCells', v)}
            />
          </>
        );

      case 'disease':
        return (
          <>
            <Text style={styles.section}>Хвороби</Text>

            <SwitchRow
              label="Понос"
              value={form.disease.diarrhea}
              onChange={(v) => handleChange('disease', 'diarrhea', v)}
            />

            <SwitchRow
              label="Деформовані крила"
              value={form.disease.deformedWings}
              onChange={(v) => handleChange('disease', 'deformedWings', v)}
            />

            <SwitchRow
              label="Кліщі"
              value={form.disease.mitesVisible}
              onChange={(v) => handleChange('disease', 'mitesVisible', v)}
            />

            <SwitchRow
              label="Проблемний розплід"
              value={form.disease.weakBrood}
              onChange={(v) => handleChange('disease', 'weakBrood', v)}
            />
          </>
        );

      case 'split':
        return (
          <>
            <Text style={styles.section}>Відводки</Text>

            <SwitchRow
              label="Це відводок"
              value={form.split.isSplit}
              onChange={(v) => handleChange('split', 'isSplit', v)}
            />

            <SwitchRow
              label="Використати для відводків"
              value={form.split.usedForSplits}
              onChange={(v) => handleChange('split', 'usedForSplits', v)}
            />

            <Text>Рамки розплоду</Text>
            <TextInput
              value={form.split.broodFrames}
              onChangeText={(v: string) =>
                handleChange('split', 'broodFrames', v)
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>Кормові рамки</Text>
            <TextInput
              value={form.split.foodFrames}
              onChangeText={(v: string) =>
                handleChange('split', 'foodFrames', v)
              }
              keyboardType="numeric"
              style={styles.input}
            />
          </>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
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

// --- UI helpers ---

const SwitchRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <View style={styles.row}>
    <Text>{label}</Text>
    <Switch value={value} onValueChange={onChange} />
  </View>
);

const TabButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.tabActive]}>
    <Text style={{color: active ? '#fff' : '#000'}}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 12},
  section: {fontSize: 16, marginVertical: 10},
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
  tab: {padding: 8},
  tabActive: {backgroundColor: '#333', borderRadius: 6},
});
