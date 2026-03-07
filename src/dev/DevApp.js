import React from 'react';
import {View, Text, Button} from 'react-native';

import {AuthProvider, useAuth} from '../auth/AuthProvider';
// import database from '@react-native-firebase/database';

// import {handleInspection} from '../actions/handleInspection';
// import {handleInspectionEffect} from '../effects/inspectionEffectHandler';
// import {buildInspectionFeedback} from '../feedback/buildInspectionFeedback';
import {auth} from '../firebase/firebase';
import {runInspectionRuntimeTest} from '../inspection/testInspection';

const DevScreen = () => {
  const {user} = useAuth();

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

  // const dbTest = async () => {
  //   try {
  //     if (!userId) {
  //       console.log('❌ NO USER');
  //       return;
  //     }

  //     await database().ref(`users/${userId}/hives/13`).set({
  //       lastStrength: 8,
  //       createdAt: Date.now(),
  //     });

  //     console.log('✅ DB WRITE OK');
  //   } catch (e) {
  //     console.log('🔥 DB ERROR:', e);
  //   }
  // };

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
      {/* <View style={{marginTop: 20}}>
        <Button title="Database Test" onPress={dbTest} />
      </View> */}
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
