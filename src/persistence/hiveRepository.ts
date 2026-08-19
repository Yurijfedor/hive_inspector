import AsyncStorage from '@react-native-async-storage/async-storage';
import {Hive} from '../types/hive';

const STORAGE_KEY = 'hives';

export class HiveRepository {
  async getAll(): Promise<Hive[]> {
    console.log('📂 LOAD HIVES');

    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      console.log('❌ PARSE HIVES FAILED', e);
      return [];
    }
  }

  async exists(hiveNumber: number): Promise<boolean> {
    const hives = await this.getAll();

    return hives.some((hive) => hive.hiveNumber === hiveNumber);
  }

  async create(hive: Hive): Promise<void> {
    const hives = await this.getAll();

    if (hives.some((item) => item.hiveNumber === hive.hiveNumber)) {
      throw new Error('Hive already exists');
    }

    const next = [...hives, hive];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    console.log('💾 LOCAL HIVE CREATED:', hive.hiveNumber);
  }

  async delete(hiveNumber: number): Promise<void> {
    const hives = await this.getAll();

    const next = hives.filter((hive) => hive.hiveNumber !== hiveNumber);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    console.log('🗑️ LOCAL HIVE DELETED:', hiveNumber);
  }
}
