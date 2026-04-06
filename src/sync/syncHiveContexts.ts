import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';
import {HiveContextRepository} from '../persistence/hiveContextRepository';

export async function syncHiveContexts(uid: string) {
  console.log('🔄 SYNC HIVE CONTEXTS START');

  try {
    const contexts = await loadHiveContextsFromFirebase(uid);

    console.log('☁️ LOADED FROM FIREBASE:', contexts.length);

    const repo = new HiveContextRepository();

    // 🔥 КЛЮЧОВИЙ ФІКС
    if (contexts.length > 0) {
      await repo.saveAll(contexts);
      console.log('💾 CACHE UPDATED');
    } else {
      console.log('⚠️ SKIP CACHE UPDATE (EMPTY RESULT)');
    }

    console.log('✅ SYNC DONE');
  } catch (e) {
    console.log('❌ SYNC FAILED', e);
  }
}
