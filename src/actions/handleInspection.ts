import {validateInspectionCommand} from './validateInspection';
import {InspectionCommand} from '../voice/schema/inspection';

export async function handleInspection(command: InspectionCommand) {
  validateInspectionCommand(command, hiveNumber => {
    return hiveNumber >= 1 && hiveNumber <= 100;
  });

  if (command.stop) {
    return {
      type: 'STOP_INSPECTION',
      hiveNumber: command.hiveNumber,
    };
  }

  return {
    type: 'UPDATE_INSPECTION',
    hiveNumber: command.hiveNumber,
    payload: {
      strength: command.strength,
      honeyKg: command.honeyKg,
      queen: command.queen,
    },
  };
}
