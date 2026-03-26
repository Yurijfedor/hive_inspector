import {useEffect, useRef} from 'react';
import {useAuth} from '../auth/AuthProvider';
import {TaskRepository} from '../domain/repositories/taskRepository';

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
        const tasks = await repo.syncWithFirebase(user.uid);
        console.log('🔄 SYNC DONE:', tasks.length);
      } catch (e) {
        console.log('❌ SYNC FAILED', e);
      }
    };

    runSync();
  }, [user]);

  return <>{children}</>;
};
