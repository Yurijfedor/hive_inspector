import React from 'react';
import {
  View,
  Text,
  Button,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import {AuthProvider, useAuth} from '../auth/AuthProvider';
import {auth} from '../firebase/firebase';
import {runInspectionRuntimeTest} from '../inspection/testInspection';
import {baseGrammar} from '../voice/grammars/baseGrammar';
import {hiveNumbers} from '../voice/grammars/hiveGrammar';
import {DevVoiceRuntime} from '../dev/DevVoiceRuntime';

const DevScreen = () => {
  const {user} = useAuth();
  const {Vosk} = NativeModules;

  const voskEmitter = new NativeEventEmitter(Vosk);

  const userId = user?.uid;

  const runtime = userId ? new DevVoiceRuntime(userId) : null;

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

    const grammar = [...baseGrammar, ...hiveNumbers];

    try {
      await Vosk.loadModel('model');
      console.log('MODEL LOADED');

      voskEmitter.removeAllListeners('onResult');
      voskEmitter.removeAllListeners('onPartialResult');

      voskEmitter.addListener('onResult', async e => {
        console.log('RESULT RAW:', JSON.stringify(e));

        const text = e?.text ?? e?.result?.text ?? '';

        console.log('👤 USER:', text);

        if (!text) return;

        await this.driver.handleExternalInput(text);
      });

      voskEmitter.addListener('onPartialResult', e => {
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
    </View>
  );
};

export default function DevApp() {
  return (
    <AuthProvider>
      <DevScreen />
    </AuthProvider>
  );
}
