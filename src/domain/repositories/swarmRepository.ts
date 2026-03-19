import database from '@react-native-firebase/database';

export async function saveSwarm(
  uid: string,
  data: {
    hiveNumber: number;
    queenEmergence?: boolean;
    sealedCells?: boolean;
    openCells?: boolean;
    eggsInCells?: boolean;
  },
) {
  const updates: Record<string, any> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔥 агрегований сигнал роїння
  const hasSwarmSigns =
    data.queenEmergence ||
    data.sealedCells ||
    data.openCells ||
    data.eggsInCells ||
    false;

  // 🔹 поточний стан
  updates[`${basePath}/currentSwarm`] = {
    ...data,
    hasSwarmSigns, // 👉 додаємо сюди
    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // 🔹 meta (швидкий доступ)
  updates[`${basePath}/meta/hasSwarmSigns`] = hasSwarmSigns;

  updates[`${basePath}/meta/lastSwarmCheckAt`] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
