import database from '@react-native-firebase/database';

export async function updateQueen(
  uid: string,
  hiveNumber: number,
  payload: Partial<{
    status: 'present' | 'absent' | 'unknown';
    breed: string;
    birthYear: number;
    marked: boolean;
  }>,
) {
  if (!payload || Object.keys(payload).length === 0) {
    return;
  }
  const updates: Record<string, any> = {};

  updates[`users/${uid}/hives/${hiveNumber}/queen/status`] = payload.status;

  if (payload.breed !== undefined) {
    updates[`users/${uid}/hives/${hiveNumber}/queen/breed`] = payload.breed;
  }

  if (payload.birthYear !== undefined) {
    updates[`users/${uid}/hives/${hiveNumber}/queen/birthYear`] =
      payload.birthYear;
  }

  updates[`users/${uid}/hives/${hiveNumber}/queen/updatedAt`] =
    database.ServerValue.TIMESTAMP;

  if (payload.status === 'present') {
    updates[`users/${uid}/hives/${hiveNumber}/queen/lastSeenAt`] =
      database.ServerValue.TIMESTAMP;
  }

  await database().ref().update(updates);
}
