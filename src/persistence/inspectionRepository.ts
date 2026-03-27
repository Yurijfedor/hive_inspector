import database from '@react-native-firebase/database';
import {InspectionCommand} from '../voice/schema/inspection';
import {Inspection} from '../types/inspection';
import auth from '@react-native-firebase/auth';

export async function saveInspection(uid: string, command: InspectionCommand) {
  console.log('🔥 AUTH USER UID:', auth().currentUser?.uid);
  console.log('🔥 UID PARAM:', uid);
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

  if (command.syrupLiters !== undefined) {
    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/syrupLiters`
    ] = command.syrupLiters;
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
  const currentRef = database().ref(
    `users/${uid}/hives/${hiveNumber}/currentInspection`,
  );

  const snapshot = await currentRef.once('value');

  if (!snapshot.exists()) return;

  const inspection = snapshot.val();

  // 🔹 1. створюємо запис в архіві
  const archiveRef = database().ref(
    `users/${uid}/hives/${hiveNumber}/inspections`,
  );

  const newRef = archiveRef.push();
  const inspectionId = newRef.key!;

  await newRef.set({
    id: inspectionId,
    ...inspection,
    createdAt: Date.now(), // 🔥 тимчасово без ServerValue
    source: 'voice',
  });

  // 🔹 2. оновлюємо meta
  await database()
    .ref(`users/${uid}/hives/${hiveNumber}/meta/inspectionClosedAt`)
    .set(Date.now());

  // 🔹 3. видаляємо currentInspection
  await currentRef.remove();

  console.log('✅ INSPECTION FINALIZED');
}

export async function loadInspections(uid: string): Promise<Inspection[]> {
  try {
    const snap = await database().ref(`users/${uid}/hives`).once('value');

    const data = snap.val();
    if (!data) return [];

    const inspections: Inspection[] = [];

    for (const hiveNumber in data) {
      const hive = data[hiveNumber];

      if (!hive?.inspections) continue;

      for (const inspectionId in hive.inspections) {
        const i = hive.inspections[inspectionId];

        inspections.push({
          id: inspectionId,
          hiveNumber: Number(hiveNumber),
          date: i.createdAt ?? 0,
          strength: i.strength ?? 0,
          honeyKg: i.honeyKg ?? 0,
          hasQueen: i.queen === 'present',
        });
      }
    }

    return inspections;
  } catch (e) {
    console.log('❌ LOAD INSPECTIONS FAILED', e);
    return [];
  }
}
