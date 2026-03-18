import database from '@react-native-firebase/database';

export async function saveSwarm(
  uid: string,
  data: {
    hiveNumber: number;
    hasSwarmSigns?: boolean;
    hasQueenCells?: boolean;
    queenCellsCount?: number;
  },
) {
  const updates: Record<string, any> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔹 поточний стан
  updates[`${basePath}/currentSwarm`] = {
    ...data,
    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // 🔹 meta (швидкий доступ)
  if (data.hasSwarmSigns !== undefined) {
    updates[`${basePath}/meta/hasSwarmSigns`] = data.hasSwarmSigns;
  }

  if (data.queenCellsCount !== undefined) {
    updates[`${basePath}/meta/queenCellsCount`] = data.queenCellsCount;
  }

  updates[`${basePath}/meta/lastSwarmCheckAt`] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
