import {ConversationDriver} from '../../conversation/driver/conversationDriver';
import {mapInspectionToFlowSequence} from './mappers/inspectionFormMapper';
import {InspectionFormUI} from './types';

export async function runInspectionBatch(
  driver: ConversationDriver,
  hiveNumber: number,
  data: InspectionFormUI,
) {
  // 1. старт flow
  await driver.startFlow('inspection', hiveNumber);

  // 2. sequence
  const sequence = mapInspectionToFlowSequence(data);

  // 3. проганяємо
  for (const value of sequence) {
    await driver.handleExternalInput(value);
  }
}
