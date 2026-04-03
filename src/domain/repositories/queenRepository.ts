import database from '@react-native-firebase/database';

export async function updateQueen(
  uid: string,
  hiveNumber: number,
  data: {
    status: 'present' | 'absent' | 'unknown';
    breed?: string;
    birthYear?: number;
  },
) {
  const updates: Record<string, any> = {};

  updates[`users/${uid}/hives/${hiveNumber}/queen/status`] = data.status;

  if (data.breed !== undefined) {
    updates[`users/${uid}/hives/${hiveNumber}/queen/breed`] = data.breed;
  }

  if (data.birthYear !== undefined) {
    updates[`users/${uid}/hives/${hiveNumber}/queen/birthYear`] =
      data.birthYear;
  }

  updates[`users/${uid}/hives/${hiveNumber}/queen/updatedAt`] =
    database.ServerValue.TIMESTAMP;

  if (data.status === 'present') {
    updates[`users/${uid}/hives/${hiveNumber}/queen/lastSeenAt`] =
      database.ServerValue.TIMESTAMP;
  }

  await database().ref().update(updates);
}
