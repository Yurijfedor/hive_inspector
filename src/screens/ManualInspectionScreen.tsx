import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {useConversation} from '../conversation/ConversationProvider';
import {runInspectionBatch} from '../features/manualInput/runInspectionBatch';

export const ManualInspectionScreen = () => {
  const route = useRoute<any>();
  const {hiveNumber} = route.params;

  const driver = useConversation(); // Тепер це працює!

  const [form] = useState({
    strength: 10,
    broodFrames: 5,
    queen: 'так',
    queenBreed: 'карніка',
    queenYear: 2024,
    honeyKg: 20,
  });

  const handleSave = async () => {
    console.log('🔥 CLICK SAVE');

    try {
      await runInspectionBatch(driver, hiveNumber, form);
    } catch (e) {
      console.log('🔥 DRIVER TYPE:', driver);
      console.log('❌ SAVE ERROR', e);
    }
  };

  return (
    <View style={{padding: 16}}>
      <Text style={{fontSize: 18}}>Вулик №{hiveNumber}</Text>
      <Button title="Зберегти" onPress={handleSave} />
    </View>
  );
};
