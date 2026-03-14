import database from '@react-native-firebase/database';
import {InspectionCommand} from '../voice/schema/inspection';

export async function saveInspection(uid: string, command: InspectionCommand) {
  if (command.stop) {
    await finalizeInspection(uid, command.hiveNumber);
    return;
  }

  await upsertInspection(uid, command);
}

/**
 * Creates or updates current inspection
 */
async function upsertInspection(uid: string, command: InspectionCommand) {
  // const inspectionRef = database().ref(
  //   `users/${uid}/hives/${command.hiveNumber}/currentInspection`,
  // );

  const updates: Record<string, any> = {};

  updates[`users/${uid}/hives/${command.hiveNumber}/meta/lastInspectionAt`] =
    database.ServerValue.TIMESTAMP;

  if (command.strength !== undefined) {
    updates[`users/${uid}/hives/${command.hiveNumber}/meta/lastStrength`] =
      command.strength;

    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/strength`
    ] = command.strength;
  }

  if (command.honeyKg !== undefined) {
    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/honeyKg`
    ] = command.honeyKg;
  }

  if (command.queen !== undefined) {
    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/queen`
    ] = command.queen;
  }

  updates[
    `users/${uid}/hives/${command.hiveNumber}/currentInspection/updatedAt`
  ] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}

/**
 * Finalizes inspection
 */
async function finalizeInspection(uid: string, hiveNumber: number) {
  const root = database().ref();

  const currentRef = database().ref(
    `users/${uid}/hives/${hiveNumber}/currentInspection`,
  );

  const snapshot = await currentRef.once('value');

  if (!snapshot.exists()) return;

  const inspection = snapshot.val();

  const archiveRef = database()
    .ref(`users/${uid}/hives/${hiveNumber}/inspections`)
    .push();

  const inspectionId = archiveRef.key;

  const updates: Record<string, any> = {};

  updates[`users/${uid}/hives/${hiveNumber}/inspections/${inspectionId}`] = {
    id: inspectionId,
    ...inspection,
    createdAt: database.ServerValue.TIMESTAMP,
    source: 'voice',
  };

  updates[`users/${uid}/hives/${hiveNumber}/meta/inspectionClosedAt`] =
    database.ServerValue.TIMESTAMP;

  updates[`users/${uid}/hives/${hiveNumber}/currentInspection`] = null;

  await root.update(updates);
}
