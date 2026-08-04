import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {InspectionCommand} from '../voice/schema/inspection';
import {Inspection, InspectionRaw} from '../types/inspection';
import {HiveContext} from '../types/hive';

export async function saveInspection(uid: string, command: InspectionCommand) {
  console.log('🔥 AUTH USER UID:', auth().currentUser?.uid);
  console.log('🔥 UID PARAM:', uid);

  if (command.stop) {
    await finalizeInspection(
      uid,
      command.hiveNumber,
      command.source, // ✅ ПРОКИДАЄМО SOURCE
    );
    return;
  }

  await upsertInspection(uid, command);
}

/**
 * Creates or updates current inspection
 */
async function upsertInspection(uid: string, command: InspectionCommand) {
  const updates: Record<string, unknown> = {};
  console.log('🔥 COMMAND:', command);
  updates[`users/${uid}/hives/${command.hiveNumber}/meta/lastInspectionAt`] =
    database.ServerValue.TIMESTAMP;

  if (command.strength !== undefined) {
    updates[`users/${uid}/hives/${command.hiveNumber}/meta/lastStrength`] =
      command.strength;

    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/strength`
    ] = command.strength;
  }

  if (command.broodFrames !== undefined) {
    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/broodFrames`
    ] = command.broodFrames;
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

  if (command.source !== undefined) {
    updates[
      `users/${uid}/hives/${command.hiveNumber}/currentInspection/source`
    ] = command.source;
  }

  updates[
    `users/${uid}/hives/${command.hiveNumber}/currentInspection/updatedAt`
  ] = database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}

/**
 * Finalizes inspection
 */
async function finalizeInspection(
  uid: string,
  hiveNumber: number,
  source: 'voice' | 'manual' | 'ai' = 'voice',
) {
  const hiveRef = database().ref(`users/${uid}/hives/${hiveNumber}`);

  const currentRef = hiveRef.child('currentInspection');

  const snapshot = await currentRef.once('value');

  if (!snapshot.exists()) return;

  const inspection = snapshot.val();

  // --------------------------------------------------
  // QUEEN SNAPSHOT
  // --------------------------------------------------

  const queenSnapshot = await hiveRef.child('queen').once('value');

  const queen = queenSnapshot.exists() ? queenSnapshot.val() : undefined;

  // --------------------------------------------------
  // FINAL INSPECTION
  // --------------------------------------------------

  const finalSource = source ?? inspection?.source ?? 'voice';

  const finalInspection: Record<string, unknown> = {
    strength: inspection.strength ?? 0,
    honeyKg: inspection.honeyKg ?? 0,
    queen: inspection.queen ?? 'unknown',
    broodFrames: inspection.broodFrames ?? 0,
    syrupLiters: inspection.syrupLiters ?? 0,
    createdAt: Date.now(),
    source: finalSource,
  };

  // Breed/year мають сенс лише якщо під час цього огляду
  // матка була зафіксована як присутня.
  if (inspection.queen === 'present') {
    if (queen?.breed !== undefined) {
      finalInspection.queenBreed = queen.breed;
    }

    if (queen?.birthYear !== undefined) {
      finalInspection.queenBirthYear = queen.birthYear;
    }
  }

  const newRef = hiveRef.child('inspections').push();

  await newRef.set(finalInspection);

  await hiveRef.child('meta').update({
    inspectionClosedAt: Date.now(),
  });

  await currentRef.remove();

  console.log('✅ FINALIZED OK', finalInspection);
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
          broodFrames: i.broodFrames ?? 0,
          honeyKg: i.honeyKg ?? 0,
          queen: i.queen ?? 'unknown',
          queenBreed: i.queenBreed,
          queenBirthYear: i.queenBirthYear,
          source: i.source ?? 'voice',
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

export async function loadHiveContextsFromFirebase(
  uid: string,
): Promise<HiveContext[]> {
  console.log('🚀 START LOAD HIVES');

  const snap = await database().ref(`users/${uid}/hives`).once('value');

  console.log('✅ SNAP RECEIVED');

  const data = snap.val();

  if (!data) {
    console.log('⚠️ NO HIVES DATA');
    return [];
  }

  const result: HiveContext[] = [];

  for (const hiveNumber in data) {
    const hive = data[hiveNumber];

    if (!hive) {
      console.warn('⚠️ SKIP NULL HIVE:', hiveNumber);
      continue;
    }

    console.log('🐝 HIVE:', hiveNumber, hive);

    let lastInspection: HiveContext['lastInspection'];

    if (hive?.inspections) {
      const inspectionsArray = Object.values(
        hive.inspections,
      ) as InspectionRaw[];

      const last = inspectionsArray.reduce<InspectionRaw | null>(
        (latest, current) => {
          if (!latest) return current;

          return (current.createdAt ?? 0) > (latest.createdAt ?? 0)
            ? current
            : latest;
        },
        null,
      );

      if (last) {
        lastInspection = {
          date: last.createdAt ?? 0,
          strength: last.strength ?? 0,
          honeyKg: last.honeyKg ?? 0,
          broodFrames: last.broodFrames ?? 0,
          queenStatus: last.queen ?? 'unknown',
        };
      }
    }

    // 🔥 FIX: нормалізуємо queen з fallback
    let queen;

    // 🟢 1. основне джерело (root hive)
    if (hive.queen) {
      queen = {
        status: hive.queen.status ?? 'unknown',

        breed: hive.queen.breed,

        birthYear: hive.queen.birthYear,

        marked: hive.queen.marked ?? false,

        lastSeenAt: hive.queen.lastSeenAt,

        updatedAt: hive.queen.updatedAt ?? 0,
      };
    }

    // 🟡 2. fallback з останнього огляду
    if (!queen && lastInspection) {
      queen = {
        status: lastInspection.queenStatus ?? 'unknown',

        updatedAt: 0,
      };
    }

    result.push({
      hiveNumber: Number(hiveNumber),
      queen,
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

            sealedCells: hive.currentSwarm.sealedCells ?? false,

            openCells: hive.currentSwarm.openCells ?? false,

            eggsInCells: hive.currentSwarm.eggsInCells ?? false,

            updatedAt: hive.currentSwarm.updatedAt,
          }
        : undefined,

      // 🟣 DISEASE
      disease: hive.currentDisease
        ? {
            disease: hive.currentDisease.disease,

            hasDiseaseSigns: hive.currentDisease.hasDiseaseSigns,

            diarrhea: hive.currentDisease.diarrhea ?? false,

            deformedWings: hive.currentDisease.deformedWings ?? false,

            mitesVisible: hive.currentDisease.mitesVisible ?? false,

            weakBrood: hive.currentDisease.weakBrood ?? false,

            updatedAt: hive.currentDisease.updatedAt,
          }
        : undefined,

      // 🔵 SPLIT
      split: hive.currentSplit
        ? {
            isSplit: hive.currentSplit.isSplit ?? false,

            usedForSplits: hive.currentSplit.usedForSplits ?? false,

            broodFrames: hive.currentSplit.broodFrames,

            foodFrames: hive.currentSplit.foodFrames,

            totalBroodFrames: hive.currentSplit.totalBroodFrames ?? 0,

            totalFoodFrames: hive.currentSplit.totalFoodFrames ?? 0,

            updatedAt: hive.currentSplit.updatedAt,
          }
        : undefined,

      // ⚫ META
      meta: {
        lastInspectionAt: hive.meta?.lastInspectionAt,

        lastFeedingAt: hive.meta?.lastFeedingAt,

        lastDiseaseCheckAt: hive.meta?.lastDiseaseCheckAt,

        lastSwarmCheckAt: hive.meta?.lastSwarmCheckAt,

        lastSplitActionAt: hive.meta?.lastSplitActionAt,

        hasFeeding: hive.meta?.hasFeeding ?? false,

        hasDiseaseSigns: hive.meta?.hasDiseaseSigns ?? false,

        hasSwarmSigns: hive.meta?.hasSwarmSigns ?? false,

        isSplit: hive.meta?.isSplit ?? false,

        usedForSplits: hive.meta?.usedForSplits ?? false,

        lastStrength: hive.meta?.lastStrength,

        lastBroodFrames: hive.meta?.lastBroodFrames,

        totalBroodFrames: hive.meta?.totalBroodFrames ?? 0,

        totalFoodFrames: hive.meta?.totalFoodFrames ?? 0,

        currentDiseaseType: hive.meta?.currentDiseaseType,
      },
    });
  }

  return result;
}

export async function loadInspectionsByHive(
  uid: string,
  hiveNumber: number,
): Promise<Inspection[]> {
  try {
    const snap = await database()
      .ref(`users/${uid}/hives/${hiveNumber}/inspections`)
      .once('value');

    const data = snap.val();
    if (!data) return [];
    console.log(data);

    const inspections: Inspection[] = [];

    for (const inspectionId in data) {
      const i = data[inspectionId];
      console.log(i);

      inspections.push({
        id: inspectionId,
        hiveNumber,
        date: i.createdAt ?? 0,
        strength: i.strength ?? 0,
        honeyKg: i.honeyKg ?? 0,
        broodFrames: i.broodFrames ?? 0,
        queen: i.queen ?? 'unknown',
        queenBreed: i.queenBreed,
        queenBirthYear: i.queenBirthYear,
        source: i.source ?? 'voice',
      });
    }

    // 🔥 ВАЖЛИВО — одразу сортуємо тут
    inspections.sort((a, b) => b.date - a.date);

    return inspections;
  } catch (e) {
    console.log('❌ LOAD INSPECTIONS BY HIVE FAILED', e);
    return [];
  }
}
