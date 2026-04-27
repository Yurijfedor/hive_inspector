import {useEffect, useRef} from 'react';
import {useAuth} from '../auth/AuthProvider';
import {runFullSync} from '../sync/runFullSync';
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
      try {
        const online = await isOnline();

        if (!online) {
          console.log('📵 OFFLINE — SKIP SYNC');
          return;
        }

        // 🔥 тільки tasks через runFullSync (але без hive)
        console.log('🔄 INITIAL TASK SYNC');

        await runFullSync(user.uid, {
          includeHives: await shouldSyncToday(),
        });

        console.log('✅ INITIAL SYNC DONE');
      } catch (e) {
        console.log('❌ SYNC FAILED', e);
      }
    };

    runSync();
  }, [user]);

  return <>{children}</>;
};
