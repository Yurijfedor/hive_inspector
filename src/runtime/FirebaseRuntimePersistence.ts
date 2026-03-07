import {RuntimePersistence} from '../conversation/runtimePersistence';
import {RuntimeState} from '../conversation/types';

import database from '@react-native-firebase/database';

export class FirebaseRuntimePersistence implements RuntimePersistence {
  constructor(private uid: string) {}

  async save(snapshot: RuntimeState) {
    console.log('☁️ FIREBASE SAVE');

    await database().ref(`users/${this.uid}/runtime`).set(snapshot);
  }

  async load(): Promise<RuntimeState | null> {
    console.log('☁️ FIREBASE LOAD');

    const snap = await database().ref(`users/${this.uid}/runtime`).get();

    if (!snap.exists()) return null;

    return snap.val();
  }

  async clear() {
    console.log('☁️ FIREBASE CLEAR');

    await database().ref(`users/${this.uid}/runtime`).remove();
  }
}
