import AsyncStorage from '@react-native-async-storage/async-storage';

import {LAST_SYNC_KEY} from './constants';

export async function shouldSyncToday(): Promise<boolean> {
  const last = await AsyncStorage.getItem(LAST_SYNC_KEY);

  if (!last) return true;

  const lastDate = new Date(Number(last));
  const now = new Date();

  return lastDate.toDateString() !== now.toDateString();
}
