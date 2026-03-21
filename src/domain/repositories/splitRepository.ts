import database from '@react-native-firebase/database';

export async function saveSplit(
  uid: string,
  data: {
    hiveNumber: number;
    isSplit?: boolean;
    usedForSplits?: boolean;
    broodFrames?: number;
    foodFrames?: number;
  },
) {
  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🧠 1. отримуємо поточний стан (працює і офлайн через кеш Firebase)
  const snapshot = await database()
    .ref(`${basePath}/currentSplit`)
    .once('value');

  const existing = snapshot.val() || {};

  // 🧠 2. накопичення
  const totalBroodFrames =
    (existing.totalBroodFrames || 0) + (data.broodFrames || 0);

  const totalFoodFrames =
    (existing.totalFoodFrames || 0) + (data.foodFrames || 0);

  // 🧠 3. формуємо фінальний стан
  const currentSplit = {
    isSplit: data.isSplit ?? existing.isSplit ?? false,
    usedForSplits: data.usedForSplits ?? existing.usedForSplits ?? false,

    totalBroodFrames,
    totalFoodFrames,

    updatedAt: database.ServerValue.TIMESTAMP,
  };

  const updates: Record<string, any> = {};

  // 🔹 основний стан
  updates[`${basePath}/currentSplit`] = currentSplit;

  // 🔹 meta (швидкий доступ)
  updates[`${basePath}/meta/totalBroodFrames`] = totalBroodFrames;
  updates[`${basePath}/meta/totalFoodFrames`] = totalFoodFrames;

  updates[`${basePath}/meta/lastSplitActionAt`] =
    database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
