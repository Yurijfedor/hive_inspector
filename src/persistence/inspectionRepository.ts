import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {InspectionCommand} from '../voice/schema/inspection';
import {Inspection, InspectionRaw} from '../types/inspection';
import {HiveContext} from '../types/hive';

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

  // 1. create inspection
  const newRef = database()
    .ref(`users/${uid}/hives/${hiveNumber}/inspections`)
    .push();

  await newRef.set({
    ...inspection,
    createdAt: Date.now(),
    source: 'voice',
  });

  // 2. update meta
  await database().ref(`users/${uid}/hives/${hiveNumber}/meta`).update({
    inspectionClosedAt: Date.now(),
  });

  // 3. remove currentInspection
  await currentRef.remove();

  console.log('✅ FINALIZED OK');
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
    console.log('✅ INSPECTIONS:', inspections);

    return inspections;
  } catch (e) {
    console.log('❌ LOAD INSPECTIONS FAILED', e);
    return [];
  }
}

export async function loadHiveContexts(uid: string): Promise<HiveContext[]> {
  console.log('🚀 START LOAD HIVES');

  const snap = await database().ref(`users/${uid}/hives`).once('value');

  console.log('✅ SNAP RECEIVED');

  const data = snap.val();
  if (!data) return [];

  const result: HiveContext[] = [];

  for (const hiveNumber in data) {
    const hive = data[hiveNumber];
    console.log('🐝 HIVE:', hiveNumber, hive);

    // 🧠 last inspection
    let lastInspection = null;

    if (hive.inspections) {
      const inspectionsArray = Object.values(
        hive.inspections,
      ) as InspectionRaw[];

      const last = inspectionsArray.sort(
        (a: any, b: any) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
      )[0];

      if (last) {
        lastInspection = {
          date: last.createdAt ?? 0,
          strength: last.strength ?? 0,
          honeyKg: last.honeyKg ?? 0,
          hasQueen: last.queen === 'present',
        };
      }
    }

    result.push({
      hiveNumber: Number(hiveNumber),

      lastInspection,

      // 🟡 FEEDING
      feeding: hive.currentFeeding
        ? {
            hasFeeding: hive.currentFeeding.hasFeeding,
            syrupLiters: hive.currentFeeding.syrupLiters ?? 0,
            lastFeedingAt:
              hive.meta?.lastFeedingAt ?? hive.currentFeeding.updatedAt,
          }
        : undefined,

      // 🔴 SWARM
      swarm: hive.currentSwarm
        ? {
            hasSwarmSigns: hive.currentSwarm.hasSwarmSigns,
            queenEmergence: hive.currentSwarm.queenEmergence ?? false,
            lastSwarmCheck:
              hive.meta?.lastSwarmCheck ?? hive.currentSwarm.updatedAt,
          }
        : undefined,

      // 🟣 DISEASE (НОВЕ 🔥)
      disease: hive.currentDisease
        ? {
            hasDiseaseSigns: hive.currentDisease.hasDiseaseSigns,
            lastDiseaseCheck:
              hive.meta?.lastDiseaseCheckAt ?? hive.currentDisease.updatedAt,
          }
        : undefined,

      // 🔵 SPLIT (НОВЕ 🔥)
      split: hive.currentSplit
        ? {
            isSplit: hive.currentSplit.isSplit,
            usedForSplits: hive.currentSplit.usedForSplits,
            totalBroodFrames: hive.currentSplit.totalBroodFrames,
            totalFoodFrames: hive.currentSplit.totalFoodFrames,
            lastSplitActionAt:
              hive.meta?.lastSplitActionAt ?? hive.currentSplit.updatedAt,
          }
        : undefined,

      // ⚫ META (як summary)
      meta: {
        lastInspectionAt: hive.meta?.lastInspectionAt,
        lastFeedingAt: hive.meta?.lastFeedingAt,
        hasFeeding: hive.meta?.hasFeeding,
        hasSwarmSigns: hive.meta?.hasSwarmSigns,
        hasDiseaseSigns: hive.meta?.hasDiseaseSigns,
        lastStrength: hive.meta?.lastStrength,
      },
    });
  }

  return result;
}
