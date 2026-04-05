import AsyncStorage from '@react-native-async-storage/async-storage';
import {HiveContext} from '../types/hive';

const STORAGE_KEY = 'hive_contexts';

export class HiveContextRepository {
  /**
   * Save all hive contexts locally
   */
  async saveAll(contexts: HiveContext[]): Promise<void> {
    console.log('💾 SAVE HIVE CONTEXTS');

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contexts));
  }

  /**
   * Load all hive contexts from cache
   */
  async loadAll(): Promise<HiveContext[]> {
    console.log('📂 LOAD HIVE CONTEXTS');

    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (e) {
      console.log('❌ PARSE HIVE CONTEXTS FAILED', e);
      return [];
    }
  }

  /**
   * Get one hive context
   */
  async getByHiveNumber(hiveNumber: number): Promise<HiveContext | null> {
    const contexts = await this.loadAll();

    return contexts.find((c) => c.hiveNumber === hiveNumber) ?? null;
  }

  /**
   * Update single hive (patch)
   */
  async updateOne(updated: HiveContext): Promise<void> {
    const contexts = await this.loadAll();

    const next = contexts.map((c) =>
      c.hiveNumber === updated.hiveNumber ? updated : c,
    );

    await this.saveAll(next);
  }

  /**
   * Clear cache (debug / logout)
   */
  async clear(): Promise<void> {
    console.log('🧹 CLEAR HIVE CONTEXTS');

    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
