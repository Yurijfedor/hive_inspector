import {useEffect, useState} from 'react';
import {loadHiveContextsFromFirebase} from '../persistence/inspectionRepository';
import {useAuth} from '../auth/AuthProvider';

export const useHives = () => {
  const {user} = useAuth();

  const [hives, setHives] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const data = await loadHiveContextsFromFirebase(user.uid);

        const numbers = data.map((h) => h.hiveNumber);

        setHives(numbers.sort((a, b) => a - b));
      } catch (e) {
        console.log('❌ LOAD HIVES FAILED', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return {hives, loading};
};
