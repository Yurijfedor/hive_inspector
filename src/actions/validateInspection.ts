import {InspectionCommand} from '../voice/schema/inspection';

export function validateInspectionCommand(
  command: InspectionCommand,
  hiveExists: (hiveNumber: number) => boolean,
) {
  if (!hiveExists(command.hiveNumber)) {
    throw new Error('Hive does not exist');
  }

  if (command.strength !== null) {
    if (command.strength < 1 || command.strength > 10) {
      throw new Error('Invalid strength value');
    }
  }

  if (command.honeyKg !== null && command.honeyKg < 0) {
    throw new Error('Invalid honey value');
  }

  return true;
}
