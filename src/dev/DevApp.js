import React from 'react';
import {View, Text, Button} from 'react-native';

import {AuthProvider, useAuth} from '../auth/AuthProvider';

import {handleInspection} from '../actions/handleInspection';
import {handleInspectionEffect} from '../effects/inspectionEffectHandler';
import {buildInspectionFeedback} from '../feedback/buildInspectionFeedback';
import {auth} from '../firebase/firebase';
import {signOut} from 'firebase/auth';

const DevScreen = () => {
  const {user} = useAuth();

  const userId = user?.uid;

  const runTest = async () => {
    const fakeCommand = {
      hiveNumber: 14,
      strength: 8,
      honeyKg: 2.5,
      queen: 'absent',
      stop: false,
    };

    const event = await handleInspection(fakeCommand);
    const result = await handleInspectionEffect(event);

    const feedback = buildInspectionFeedback(result);

    console.log('🗣 FEEDBACK:', feedback);
    console.log('USER:', user?.uid);
  };

  const handleSignOut = async () => {
    console.log('SIGN OUT PRESSED');

    try {
      await auth().signOut();
    } catch (e) {
      console.log('SIGN OUT ERROR:', e);
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
