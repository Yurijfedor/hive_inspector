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

  // -------------------------
  // existing state
  // -------------------------
  const snapshot = await database()
    .ref(`${basePath}/currentSplit`)
    .once('value');

  const existing = snapshot.val() ?? {};

  // -------------------------
  // cumulative metrics
  // -------------------------
  const totalBroodFrames =
    Number(existing.totalBroodFrames ?? 0) + Number(data.broodFrames ?? 0);

  const totalFoodFrames =
    Number(existing.totalFoodFrames ?? 0) + Number(data.foodFrames ?? 0);

  // -------------------------
  // normalized split state
  // -------------------------
  const currentSplit = {
    isSplit: data.isSplit ?? existing.isSplit ?? false,

    usedForSplits: data.usedForSplits ?? existing.usedForSplits ?? false,

    broodFrames: data.broodFrames ?? null,

    foodFrames: data.foodFrames ?? null,

    totalBroodFrames,

    totalFoodFrames,

    updatedAt: database.ServerValue.TIMESTAMP,
  };

  const updates: Record<string, unknown> = {};

  // -------------------------
  // current state
  // -------------------------
  updates[`${basePath}/currentSplit`] = currentSplit;

  // -------------------------
  // meta
  // -------------------------
  updates[`${basePath}/meta/isSplit`] = currentSplit.isSplit;

  updates[`${basePath}/meta/usedForSplits`] = currentSplit.usedForSplits;

  updates[`${basePath}/meta/totalBroodFrames`] = totalBroodFrames;

  updates[`${basePath}/meta/totalFoodFrames`] = totalFoodFrames;

  updates[`${basePath}/meta/lastSplitActionAt`] =
    database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
