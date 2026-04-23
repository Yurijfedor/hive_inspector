import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useConversation} from '../conversation/ConversationProvider';
import {runInspectionBatch} from '../features/manualInput/runInspectionBatch';

export const ManualInspectionScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;

  const driver = useConversation();

  const [strength, setStrength] = useState('10');
  const [brood, setBrood] = useState('5');
  const [queen, setQueen] = useState<'так' | 'ні'>('так');
  const [honey, setHoney] = useState('20');

  const handleSave = async () => {
    console.log('🔥 CLICK SAVE');

    try {
      await runInspectionBatch(driver, hiveNumber, {
        strength: Number(strength),
        broodFrames: Number(brood),
        queen,
        honeyKg: Number(honey),
      });
    } catch (e) {
      console.log('❌ SAVE ERROR', e);
    }
  };

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18, marginBottom: 12}}>
        🐝 Вулик №{hiveNumber}
      </Text>

      <Text>Сила (рамки)</Text>
      <TextInput
        value={strength}
        onChangeText={setStrength}
        keyboardType="numeric"
        style={{borderWidth: 1, marginBottom: 10, padding: 6}}
      />

      <Text>Розплід (рамки)</Text>
      <TextInput
        value={brood}
        onChangeText={setBrood}
        keyboardType="numeric"
        style={{borderWidth: 1, marginBottom: 10, padding: 6}}
      />

      <Text>Матка (так / ні)</Text>
      <TextInput
        value={queen}
        onChangeText={(v) => setQueen(v as 'так' | 'ні')}
        style={{borderWidth: 1, marginBottom: 10, padding: 6}}
      />

      <Text>Мед (кг)</Text>
      <TextInput
        value={honey}
        onChangeText={setHoney}
        keyboardType="numeric"
        style={{borderWidth: 1, marginBottom: 20, padding: 6}}
      />

      <Button title="💾 Зберегти" onPress={handleSave} />
    </View>
  );
};
