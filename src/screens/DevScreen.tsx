import React from 'react';
import {
  View,
  Text,
  Button,
  // NativeModules,
  // NativeEventEmitter,
} from 'react-native';
import database from '@react-native-firebase/database';

import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {auth} from '../firebase/firebase';
// import {runInspectionRuntimeTest} from '../flows/testInspection';
// import {baseGrammar} from '../voice/grammars/baseGrammar';
// import {hiveNumbers} from '../voice/grammars/hiveGrammar';
import {DevVoiceRuntime} from '../dev/DevVoiceRuntime';
// import {mapLLMTasksToDomain} from '../services/ai/mapTasks';
// import {loadTasks} from '../services/tasks/tasksStorage';
import {TaskRepository} from '../domain/repositories/taskRepository';
// import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';
import {generateTasksForApiary} from '../services/ai/generateTasks';
import {syncHiveContexts} from '../sync/syncHiveContexts';
import {mapTasksToViewModel} from '../services/tasks/mapTasksToViewModel';

// import {HiveContextRepository} from '../persistence/hiveContextRepository';
// import {syncHiveContexts} from '../sync/syncHiveContexts';
// import {waitForConnection} from '../firebase/waitForConnection';
// import {
//   loadHiveContextsFromFirebase,
//   loadInspections,
// } from '../persistence/inspectionRepository';

export const DevScreen = () => {
  const {user} = useAuth();
  // const {Vosk} = NativeModules;

  const navigation = useNavigation<any>(); // 👈 ДОДАЛИ

  // const voskEmitter = new NativeEventEmitter(Vosk);

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
    </View>
  );
};
