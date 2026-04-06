import {RuntimePersistence} from '../conversation/driver/runtimePersistence';
import {RuntimeState} from '../conversation/types';
import database from '@react-native-firebase/database';

export class FirebaseRuntimePersistence implements RuntimePersistence {
  constructor(private uid: string) {}

  async save(snapshot: RuntimeState) {
    console.log('☁️ FIREBASE SAVE');

    try {
      await database().ref(`users/${this.uid}/runtime`).set(snapshot);
    } catch (e) {
      console.log('❌ FIREBASE SAVE FAILED', e);
    }
  }

  async load(): Promise<RuntimeState | null> {
    console.log('☁️ FIREBASE LOAD');

    try {
      const snap = await database().ref(`users/${this.uid}/runtime`).get();

      if (!snap.exists()) return null;

      return snap.val();
    } catch (e) {
      console.log('❌ FIREBASE LOAD FAILED', e);
      return null;
    }
  }

  async clear() {
    console.log('☁️ FIREBASE CLEAR');

    try {
      await database().ref(`users/${this.uid}/runtime`).remove();
    } catch (e) {
      console.log('❌ FIREBASE CLEAR FAILED', e);
    }
  }
}
