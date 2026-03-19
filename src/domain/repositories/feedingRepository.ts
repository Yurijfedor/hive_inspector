import database from '@react-native-firebase/database';

export async function saveFeeding(
  uid: string,
  data: {
    hiveNumber: number;
    syrupLiters: number;
  },
) {
  const updates: Record<string, any> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔥 простий індикатор (було годування)
  const hasFeeding = data.syrupLiters > 0;

  // 🔹 поточний стан
  updates[`${basePath}/currentFeeding`] = {
    ...data,
    hasFeeding,
    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // 🔹 meta (швидкий доступ)
  updates[`${basePath}/meta/hasFeeding`] = hasFeeding;
  updates[`${basePath}/meta/lastFeedingAt`] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
