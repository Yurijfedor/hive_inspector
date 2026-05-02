import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import database from '@react-native-firebase/database';

import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {auth} from '../firebase/firebase';
import {DevVoiceRuntime} from '../dev/DevVoiceRuntime';
import {TaskRepository} from '../domain/repositories/taskRepository';
import {generateTasksForApiary} from '../services/ai/generateTasks';
import {syncHiveContexts} from '../sync/syncHiveContexts';
import {mapTasksToViewModel} from '../services/tasks/mapTasksToViewModel';
import {getApiarySummary} from '../services/apiaryService';

export const DevScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation<any>();

  const {VoiceService} = NativeModules;
  const emitterRef = useRef(new NativeEventEmitter(VoiceService));

  useEffect(() => {
    const emitter = emitterRef.current;

    console.log('📡 Subscribing to VoiceService events');

    const sub1 = emitter.addListener('onStateChanged', (e) =>
      console.log('STATE:', e),
    );
    const sub2 = emitter.addListener('onWakeWord', (e) =>
      console.log('WAKE:', e),
    );
    const sub3 = emitter.addListener('onSpeechResult', (e) =>
      console.log('SPEECH:', e),
    );

    return () => {
      console.log('🧹 Cleanup listeners');
      sub1.remove();
      sub2.remove();
      sub3.remove();
    };
  }, []);

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

  const handleSignOut = async () => {
    console.log('SIGN OUT PRESSED');

    try {
      await auth().signOut();
    } catch (e) {
      console.log('SIGN OUT ERROR:', e);
    }
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
        <Button title="SignOut" onPress={handleSignOut} />
      </View>

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
      <View style={{marginTop: 20}}>
        <Button
          title="▶️ Start Voice Service"
          onPress={() => {
            console.log('🚀 START SERVICE');
            VoiceService.startService();
          }}
        />
      </View>

      <View style={{marginTop: 20}}>
        <Button
          title="⛔ Stop Voice Service"
          onPress={() => {
            console.log('🛑 STOP SERVICE');
            VoiceService.stopService();
          }}
        />
      </View>
    </View>
  );
};
