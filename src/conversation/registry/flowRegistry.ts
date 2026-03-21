import {ConversationFlow} from '../../flows/conversationFlow';
import {inspectionFlow} from '../../flows/inspection/inspectionDefinition';
import {feedingFlow} from '../../flows/feeding/feedingDefinition';
import {hiveSelectionFlow} from '../../flows/hiveDefinition';
import {hiveSelectedFlow} from '../../flows/hiveSelectedDefinition';
import {commandFlow} from '../../flows/commandDefinition';
import {swarmFlow} from '../../flows/swarm/swarmDefinition';
import {diseaseFlow} from '../../flows/disease/diseaseDefinition';
import {splitFlow} from '../../flows/split/splitDefinition';

const flows = new Map<string, ConversationFlow<any>>();

flows.set(inspectionFlow.id, inspectionFlow);
flows.set(feedingFlow.id, feedingFlow);
flows.set(hiveSelectionFlow.id, hiveSelectionFlow);
flows.set(hiveSelectedFlow.id, hiveSelectedFlow);
flows.set(commandFlow.id, commandFlow);
flows.set(swarmFlow.id, swarmFlow);
flows.set(diseaseFlow.id, diseaseFlow);
flows.set(splitFlow.id, splitFlow);

export function getFlow(id: string) {
  return flows.get(id);
}

export function registerFlow(flow: ConversationFlow<any>) {
  flows.set(flow.id, flow);
}
