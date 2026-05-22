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
  const updates: Record<string, unknown> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔥 aggregated swarm signal
  const hasSwarmSigns =
    data.queenEmergence === true ||
    data.sealedCells === true ||
    data.openCells === true ||
    data.eggsInCells === true;

  // -------------------------
  // current swarm state
  // -------------------------
  updates[`${basePath}/currentSwarm`] = {
    queenEmergence: data.queenEmergence ?? false,

    sealedCells: data.sealedCells ?? false,

    openCells: data.openCells ?? false,

    eggsInCells: data.eggsInCells ?? false,

    hasSwarmSigns,

    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // -------------------------
  // meta
  // -------------------------
  updates[`${basePath}/meta/hasSwarmSigns`] = hasSwarmSigns;

  updates[`${basePath}/meta/lastSwarmCheckAt`] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
