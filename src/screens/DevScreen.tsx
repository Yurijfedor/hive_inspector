import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import database from '@react-native-firebase/database';

import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
// import {auth} from '../firebase/firebase';
import {DevVoiceRuntime} from '../dev/DevVoiceRuntime';
import {TaskRepository} from '../domain/repositories/taskRepository';
import {generateTasksForApiary} from '../services/ai/generateTasks';
import {syncHiveContexts} from '../sync/syncHiveContexts';
import {mapTasksToViewModel} from '../services/tasks/mapTasksToViewModel';
import {getApiarySummary} from '../services/apiaryService';

export const DevScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const {BluetoothAudio} = NativeModules;
  const {Vosk} = NativeModules;

  if (!user) {
    console.log('❌ Not authenticated');
    return;
  }
  const userId = user?.uid;
  const runtime = userId ? new DevVoiceRuntime(userId) : null;
  const repo = new TaskRepository();

  const runTestSync = async () => {
    if (!userId) return;

    console.log('🔄 MANUAL SYNC START');

    await syncHiveContexts(userId);
  };

  const testHiveSync = async () => {
    const snap = await database().ref(`users/${userId}/hives`).once('value');

    const raw = (snap.val() ?? {}) as Record<string, any>;

    const hives = Object.entries(raw).map(([hiveNumber, hive]) => ({
      hiveNumber: Number(hiveNumber),
      ...hive,
    }));

    console.log('🐝 HIVES:', hives);
  };

  const testAI = async () => {
    console.log('🤖 AI TEST START');

    const mergedTasks = await generateTasksForApiary(userId);
    if (!mergedTasks || mergedTasks.length === 0) {
      console.log('😴 NO NEW TASKS');
      return;
    }

    console.log('✅ MERGED TASKS:', mergedTasks);

    // 🚀 ПЕРЕХІД НА TasksScreen
    if (mergedTasks && mergedTasks.length > 0) {
      navigation.navigate('Tasks', {
        initialTasks: mergedTasks,
      });
    }
  };

  const testLoad = async () => {
    const tasks = await repo.getAll();
    const vm = mapTasksToViewModel(tasks);
    console.log('VM:', vm);
    console.log('📦 LOADED TASKS:', tasks);

    // 🚀 ПЕРЕХІД НА TodayScreen
    navigation.navigate('Today');
  };

  const testApiarySummary = async () => {
    const summary = await getApiarySummary(userId);
    console.log('🍯 APIARY SUMMARY:', summary);
    navigation.navigate('Apiary');
  };

  const testBluetoothAudio = async () => {
    try {
      const result = await BluetoothAudio.getAudioDevices();

      console.log(
        '🎧 BLUETOOTH AUDIO DEVICES:',
        JSON.stringify(result, null, 2),
      );
    } catch (error) {
      console.log('❌ BLUETOOTH AUDIO ERROR:', error);
    }
  };

  const testBluetoothScoAudioRecord = async () => {
    console.log('🟢 TEST BLUETOOTH SCO AUDIO RECORD');

    try {
      const result = await BluetoothAudio.testBluetoothScoAudioRecord();

      console.log('🎧 BLUETOOTH SCO RESULT:', result);
    } catch (error) {
      console.log('❌ BLUETOOTH SCO ERROR:', error);
    }
  };
  const stopBluetoothAudioRecord = () => {
    BluetoothAudio.stopBluetoothAudioRecord();
  };

  const setBluetoothInput = async () => {
    console.log('🟢 BUTTON PRESSED');

    try {
      console.log('🟢 BluetoothAudio:', BluetoothAudio);

      const result = await BluetoothAudio.setBluetoothInput();

      console.log('🎧 SET BLUETOOTH INPUT:', result);

      const communicationDevice = await BluetoothAudio.getCommunicationDevice();

      console.log(
        '🎧 COMMUNICATION DEVICE:',
        JSON.stringify(communicationDevice, null, 2),
      );
    } catch (error) {
      console.log('❌ SET BLUETOOTH INPUT ERROR:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Text style={{fontSize: 22, marginBottom: 20}}>BeeVoice Dev App</Text>
      <Text style={{marginBottom: 20}}>User: {userId}</Text>

      <Button title="🔄 Sync Hives" onPress={runTestSync} />

      <View style={{marginTop: 20}}>
        <Button title="Test Hive Sync" onPress={testHiveSync} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Start Voice Runtime" onPress={() => runtime?.start()} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Test AI" onPress={testAI} />
      </View>

      <View style={{marginTop: 20}}>
        <Button
          title="Load Tasks"
          onPress={() => {
            testLoad();
          }}
        />
      </View>

      <View style={{marginTop: 20}}>
        <Button
          title="📅 Open Tasks List"
          onPress={() => navigation.navigate('TasksList')}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Button title="ApiarySummary" onPress={testApiarySummary} />
      </View>
      <TouchableOpacity style={{marginTop: 20}} onPress={testBluetoothAudio}>
        <Text>🎧 Test Bluetooth Audio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{marginTop: 20}} onPress={setBluetoothInput}>
        <Text>🎤 Select Bluetooth Microphone</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={testBluetoothScoAudioRecord}>
        <Text>🎧 Test Bluetooth SCO Microphone</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={stopBluetoothAudioRecord}>
        <Text>⏹ Stop Bluetooth Microphone Test</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={async () => {
          console.log('🟢 TEST BLUETOOTH SCO PRESSED');

          try {
            const result = await Vosk.testBluetoothCommunicationAudio();

            console.log('✅ Bluetooth SCO test result:', result);
          } catch (error) {
            console.error('❌ Bluetooth SCO test failed:', error);
          }
        }}>
        <Text>Test Bluetooth SCO Input</Text>
      </TouchableOpacity>
    </View>
  );
};
