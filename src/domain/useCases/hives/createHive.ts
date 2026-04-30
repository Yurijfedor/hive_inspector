import database from '@react-native-firebase/database';

export async function createHive(uid: string, hiveNumber: number) {
  const ref = database().ref(`users/${uid}/hives/${hiveNumber}`);

  const snapshot = await ref.get();

  if (snapshot.exists()) {
    throw new Error('Hive already exists');
  }

  await ref.set({
    meta: {
      createdAt: Date.now(),
    },
  });
}
