import {useEffect, useRef} from 'react';
import {useAuth} from '../auth/AuthProvider';
import {TaskRepository} from '../domain/repositories/taskRepository';
import {syncHiveContexts} from '../sync/syncHiveContexts';
import {shouldSyncToday} from '../sync/shouldSyncToday';
import {isOnline} from '../sync/isOnline';

export const SyncGate = ({children}: {children: React.ReactNode}) => {
  const {user} = useAuth();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (hasSyncedRef.current) return;

    hasSyncedRef.current = true;

    const runSync = async () => {
      const repo = new TaskRepository();

      try {
        // 🔍 перевірка інтернету
        const online = await isOnline();

        if (!online) {
          console.log('📵 OFFLINE — SKIP SYNC');
          return;
        }

        // 🔁 1. TASKS (як було)
        const tasks = await repo.syncWithFirebase(user.uid);
        console.log('🔄 TASK SYNC DONE:', tasks.length);

        // 🔁 2. HIVE CONTEXTS (раз на день)
        const shouldSync = await shouldSyncToday();

        if (shouldSync) {
          console.log('🔄 HIVE SYNC START');

          await syncHiveContexts(user.uid);

          console.log('✅ HIVE SYNC DONE');
        } else {
          console.log('⏭ HIVE SYNC SKIPPED (already today)');
        }
      } catch (e) {
        console.log('❌ SYNC FAILED', e);
      }
    };

    runSync();
  }, [user]);

  return <>{children}</>;
};
