import AsyncStorage from '@react-native-async-storage/async-storage';

import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';
import {HiveContextRepository} from '../persistence/hiveContextRepository';
import {LAST_SYNC_KEY} from './constants';

export async function syncHiveContexts(uid: string) {
  console.log('🔄 SYNC HIVE CONTEXTS START');

  try {
    const contexts = await loadHiveContextsFromFirebase(uid);

    console.log('☁️ LOADED FROM FIREBASE:', contexts.length);

    const repo = new HiveContextRepository();

    if (contexts.length > 0) {
      await repo.saveAll(contexts);
      console.log('💾 CACHE UPDATED');

      // ✅ фіксуємо час синку
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } else {
      console.log('⚠️ SKIP CACHE UPDATE (EMPTY RESULT)');
    }

    console.log('✅ SYNC DONE');
  } catch (e) {
    console.log('❌ SYNC FAILED', e);
  }
}
