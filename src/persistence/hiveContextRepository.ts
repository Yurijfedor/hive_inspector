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

    const exists = contexts.some((c) => c.hiveNumber === updated.hiveNumber);

    const next = exists
      ? contexts.map((c) => (c.hiveNumber === updated.hiveNumber ? updated : c))
      : [...contexts, updated];

    await this.saveAll(next);
  }
  /**
   * Clear cache (debug / logout)
   */
  async clear(): Promise<void> {
    console.log('🧹 CLEAR HIVE CONTEXTS');

    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async deleteByHiveNumber(hiveNumber: number): Promise<void> {
    const contexts = await this.loadAll();

    const next = contexts.filter(
      (context) => context.hiveNumber !== hiveNumber,
    );

    await this.saveAll(next);

    console.log('🗑️ LOCAL HIVE CONTEXT DELETED:', hiveNumber);
  }
}
