import database from '@react-native-firebase/database';

import type {QueenBreed, QueenStatus} from '../../types/queen';
import {QUEEN_STATUS} from '../../domain/constants/queen';

export async function updateQueen(
  uid: string,
  hiveNumber: number,
  payload: Partial<{
    status: QueenStatus;

    breed: QueenBreed;

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

  if (payload.status === QUEEN_STATUS.PRESENT) {
    updates[`users/${uid}/hives/${hiveNumber}/queen/lastSeenAt`] =
      database.ServerValue.TIMESTAMP;
  }

  await database().ref().update(updates);
}
