import database from '@react-native-firebase/database';

import {getDeletedHives, unmarkHiveDeleted} from './deletedHives';

export async function syncDeletedHives(uid: string): Promise<void> {
  const deletedHives = await getDeletedHives();

  if (deletedHives.length === 0) {
    console.log('🗑️ NO DELETED HIVES TO SYNC');
    return;
  }

  console.log('🗑️ SYNC DELETED HIVES:', deletedHives);

  for (const hiveNumber of deletedHives) {
    try {
      await database().ref(`users/${uid}/hives/${hiveNumber}`).remove();

      await unmarkHiveDeleted(hiveNumber);

      console.log('☁️ HIVE DELETED FROM FIREBASE:', hiveNumber);
    } catch (e) {
      console.log('❌ FAILED TO DELETE HIVE FROM FIREBASE:', hiveNumber, e);
    }
  }
}
