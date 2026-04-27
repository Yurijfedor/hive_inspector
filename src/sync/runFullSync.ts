import {TaskRepository} from '../domain/repositories/taskRepository';
import {syncHiveContexts} from './syncHiveContexts';
import {isOnline} from './isOnline';

type SyncOptions = {
  includeHives?: boolean;
};

export async function runFullSync(uid: string, options: SyncOptions = {}) {
  const {includeHives = true} = options;

  const repo = new TaskRepository();

  const online = await isOnline();

  if (!online) {
    throw new Error('Offline');
  }

  // 🔁 TASKS — завжди
  const tasks = await repo.syncWithFirebase(uid);
  console.log('🔄 TASK SYNC DONE:', tasks.length);

  // 🔁 HIVES — опціонально
  if (includeHives) {
    console.log('🔄 HIVE SYNC START');

    await syncHiveContexts(uid);

    console.log('✅ HIVE SYNC DONE');
  } else {
    console.log('⏭ HIVE SYNC SKIPPED');
  }

  console.log('✅ FULL SYNC DONE');
}
