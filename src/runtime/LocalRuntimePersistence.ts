import AsyncStorage from '@react-native-async-storage/async-storage';
import {RuntimePersistence} from '../conversation/runtimePersistence';
import {RuntimeState} from '../conversation/types';

const STORAGE_KEY = 'hive_runtime';

export class LocalRuntimePersistence implements RuntimePersistence {
  async save(snapshot: RuntimeState) {
    console.log('💾 LOCAL SAVE');

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  async load(): Promise<RuntimeState | null> {
    console.log('📂 LOCAL LOAD');

    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data);
  }

  async clear() {
    console.log('🧹 LOCAL CLEAR');

    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
