import {buildInspectionCommand} from '../domain/commands/buildInspectionCommand';
import {buildSwarmCommand} from '../domain/commands/buildSwarmCommand';
import {buildDiseaseCommand} from '../domain/commands/buildDiseaseCommand';
import {buildSplitCommand} from '../domain/commands/buildSplitCommand';

export async function runManualBatch(
  driver: any,
  hiveNumber: number,
  form: any,
) {
  const events = [];

  // 🟢 inspection
  if (form.inspection) {
    events.push(buildInspectionCommand(hiveNumber, form.inspection));
  }

  // 🟡 swarm
  if (form.swarm) {
    events.push(buildSwarmCommand(hiveNumber, form.swarm));
  }

  // 🟡 disease
  if (form.disease) {
    events.push(buildDiseaseCommand(hiveNumber, form.disease));
  }

  // 🟡 split
  if (form.split) {
    events.push(buildSplitCommand(hiveNumber, form.split));
  }

  // 🔥 головне — без flow engine
  for (const event of events) {
    await driver.handleDomainEvent(event);
  }
}
