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

const DevScreen = () => {
  const {user} = useAuth();
  const {Vosk} = NativeModules;
  const voskEmitter = new NativeEventEmitter(Vosk);

  const userId = user?.uid;

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

    try {
      await Vosk.loadModel('model');
      console.log('MODEL LOADED');

      voskEmitter.removeAllListeners('onResult');
      voskEmitter.removeAllListeners('onPartialResult');

      voskEmitter.addListener('onResult', e => {
        console.log('RESULT RAW:', JSON.stringify(e));
      });

      voskEmitter.addListener('onPartialResult', e => {
        console.log('PARTIAL RAW:', JSON.stringify(e));
      });

      await Vosk.start({
        sampleRate: 16000,
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
