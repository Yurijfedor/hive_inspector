import {ConversationDriver} from '../../conversation/driver/conversationDriver';
import {mapManualToFlowInput} from './manualInputAdapter';

export async function runFlowFromManual(
  driver: ConversationDriver,
  flowId: string,
  hiveNumber: number,
  data: Record<string, any>,
) {
  // 1. старт flow
  await driver.startFlow(flowId, hiveNumber);

  // 2. перетворюємо UI → voice input
  const inputs = mapManualToFlowInput(flowId, data);

  // 3. проганяємо як голос
  for (const input of inputs) {
    await driver.handleExternalInput(input);
  }
}
