import React from 'react';
import {
  View,
  Text,
  Button,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {auth} from '../firebase/firebase';
import {runInspectionRuntimeTest} from '../flows/testInspection';
// import {baseGrammar} from '../voice/grammars/baseGrammar';
// import {hiveNumbers} from '../voice/grammars/hiveGrammar';
import {DevVoiceRuntime} from '../dev/DevVoiceRuntime';
import {mapLLMTasksToDomain} from '../services/ai/mapTasks';
// import {loadTasks} from '../services/tasks/tasksStorage';
import {TaskRepository} from '../domain/repositories/taskRepository';

export const DevScreen = () => {
  const {user} = useAuth();
  const {Vosk} = NativeModules;

  const navigation = useNavigation<any>(); // 👈 ДОДАЛИ

  const voskEmitter = new NativeEventEmitter(Vosk);

  const userId = user?.uid;

  const runtime = userId ? new DevVoiceRuntime(userId) : null;

  const repo = new TaskRepository();

  const runTest = async () => {
    console.log('🚀 RUN TEST START');

    if (!userId) {
      console.log('❌ NO USER');
      return;
    }

    await runInspectionRuntimeTest(userId);
  };

  const handleSignOut = async () => {
    console.log('SIGN OUT PRESSED');

    try {
      await auth().signOut();
    } catch (e) {
      console.log('SIGN OUT ERROR:', e);
    }
  };

  const testVosk = async () => {
    console.log('🧪 TEST START');

    // const grammar = [...baseGrammar, ...hiveNumbers];

    try {
      await Vosk.loadModel('model');
      console.log('MODEL LOADED');

      voskEmitter.removeAllListeners('onResult');
      voskEmitter.removeAllListeners('onPartialResult');

      voskEmitter.addListener('onResult', async (e) => {
        console.log('RESULT RAW:', JSON.stringify(e));

        const text = e?.text ?? e?.result?.text ?? '';

        console.log('👤 USER:', text);

        if (!text) return;

        await runtime?.handleTextInput(text);
      });

      voskEmitter.addListener('onPartialResult', (e) => {
        console.log('PARTIAL:', e.partial);
      });

      await Vosk.start({
        sampleRate: 16000,
        grammar: ['огляд', 'огляду', 'годівля', 'годувати', 'годування'],
      });

      console.log('🎤 LISTENING...');
    } catch (e) {
      console.log('❌ ERROR:', e);
    }
  };

  const testAI = async () => {
    console.log('🤖 AI TEST START');

    const res = await fetch(
      'https://us-central1-hiveinspector-613f8.cloudfunctions.net/generateTasksHttp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspections: [
            {
              hiveNumber: 1,
              strength: 5,
              honeyKg: 2,
              hasQueen: true,
            },
          ],
        }),
      },
    );

    const data = await res.json();
    console.log(data);

    // const tasks = mapLLMTasksToDomain(data.tasks);
    const mappedTasks = mapLLMTasksToDomain(data);
    const mergedTasks = await repo.mergeFromAI(mappedTasks);

    console.log('✅ MAPPED TASKS:', mappedTasks);
    console.log('✅ MERGED TASKS:', mergedTasks);

    // 🚀 ПЕРЕХІД НА TasksScreen
    navigation.navigate('Tasks', {
      initialTasks: mergedTasks,
    });
  };

  const testLoad = async () => {
    const tasks = await repo.getAll();
    console.log('📦 LOADED TASKS:', tasks);
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

      <Button title="Run Inspection Test" onPress={runTest} />

      <View style={{marginTop: 20}}>
        <Button title="SignOut" onPress={handleSignOut} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Test Vosk" onPress={testVosk} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Start Voice Runtime" onPress={() => runtime?.start()} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Test AI" onPress={testAI} />
      </View>

      <View style={{marginTop: 20}}>
        <Button title="Load Tasks" onPress={testLoad} />
      </View>
    </View>
  );
};
