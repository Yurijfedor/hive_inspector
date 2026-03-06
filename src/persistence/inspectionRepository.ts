import database from '@react-native-firebase/database';
import {InspectionCommand} from '../voice/schema/inspection';

export async function saveInspection(uid: string, command: InspectionCommand) {
  if (command.stop) {
    await finalizeInspection(uid, command.hiveNumber);
    return;
  }

  await saveInspectionData(uid, command);
}

/**
 * Saves a single inspection event
 */
async function saveInspectionData(uid: string, command: InspectionCommand) {
  const hivePath = `users/${uid}/hives/${command.hiveNumber}`;
  const hiveRef = database().ref(hivePath);

  const inspectionRef = hiveRef.child('inspections').push();

  await hiveRef.update({
    lastInspectionAt: database.ServerValue.TIMESTAMP,
    lastStrength: command.strength ?? null,
  });

  await inspectionRef.set({
    strength: command.strength ?? null,
    honeyKg: command.honeyKg ?? null,
    queen: command.queen ?? null,
    createdAt: database.ServerValue.TIMESTAMP,
    source: 'voice',
  });
}

/**
 * Finalizes inspection
 */
async function finalizeInspection(uid: string, hiveNumber: number) {
  const hiveRef = database().ref(`users/${uid}/hives/${hiveNumber}`);

  await hiveRef.update({
    inspectionClosedAt: database.ServerValue.TIMESTAMP,
  });
}

// export async function saveInspection(command: any) {
//   console.log('MOCK SAVE INSPECTION:', command);

//   return {
//     ok: true,
//   };
// }
