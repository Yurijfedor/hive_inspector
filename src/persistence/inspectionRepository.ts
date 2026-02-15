import database from '@react-native-firebase/database';
import {InspectionCommand} from '../voice/schema/inspection';

export async function saveInspection(command: InspectionCommand) {
  if (command.stop) {
    await finalizeInspection(command.hiveNumber);
    return;
  }

  await saveInspectionData(command);
}

/**
 * Saves a single inspection event (domain event)
 */
async function saveInspectionData(command: InspectionCommand) {
  const hivePath = `hives/${command.hiveNumber}`;
  const hiveRef = database().ref(hivePath);

  const inspectionRef = hiveRef.child('inspections').push();

  await hiveRef.update({
    lastInspectionAt: database.ServerValue.TIMESTAMP,
    lastStrength: command.strength ?? null,
  });

  await inspectionRef.update({
    strength: command.strength ?? null,
    honeyKg: command.honeyKg ?? null,
    queen: command.queen ?? null,
    createdAt: database.ServerValue.TIMESTAMP,
    source: 'voice',
  });
}

/**
 * Finalizes current inspection session
 */
async function finalizeInspection(hiveNumber: number) {
  const hiveRef = database().ref(`hives/${hiveNumber}`);

  await hiveRef.update({
    inspectionClosedAt: database.ServerValue.TIMESTAMP,
  });
}
