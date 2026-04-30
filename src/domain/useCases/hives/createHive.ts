import database from '@react-native-firebase/database';

export async function createHive(uid: string, hiveNumber: number) {
  const ref = database().ref(`users/${uid}/hives/${hiveNumber}`);

  // ❗ ВАЖЛИВО: використовуємо once
  const snapshot = await ref.once('value');

  if (snapshot.exists()) {
    throw new Error('Hive already exists');
  }

  await ref.set({
    meta: {
      createdAt: Date.now(),
    },
  });
}
