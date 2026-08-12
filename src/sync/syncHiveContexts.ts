import AsyncStorage from '@react-native-async-storage/async-storage';

import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';
import {HiveContextRepository} from '../persistence/hiveContextRepository';
import {LAST_SYNC_KEY} from './constants';

export async function syncHiveContexts(uid: string) {
  console.log('🔄 SYNC HIVE CONTEXTS START');

  try {
    const contexts = await loadHiveContextsFromFirebase(uid);

    console.log(
      '☁️ LOADED FROM FIREBASE:',
      contexts.length,
      contexts.map((h) => h.hiveNumber),
    );

    const repo = new HiveContextRepository();

    await repo.saveAll(contexts);

    console.log(
      '💾 CACHE UPDATED:',
      contexts.length,
      contexts.map((h) => h.hiveNumber),
    );

    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());

    console.log('✅ SYNC DONE');

    return contexts;
  } catch (e) {
    console.log('❌ SYNC FAILED', e);
    throw e;
  }
}
