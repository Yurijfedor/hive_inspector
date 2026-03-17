import {ConversationFlow} from '../../flows/conversationFlow';
import {inspectionFlow} from '../../flows/inspection/inspectionDefinition';
import {feedingFlow} from '../../flows/feeding/feedingDefinition';
import {hiveSelectionFlow} from '../../flows/hiveDefinition';
import {hiveSelectedFlow} from '../../flows/hiveSelectedDefinition';
import {commandFlow} from '../../flows/commandDefinition';

const flows = new Map<string, ConversationFlow<any>>();

flows.set(inspectionFlow.id, inspectionFlow);
flows.set(feedingFlow.id, feedingFlow);
flows.set(hiveSelectionFlow.id, hiveSelectionFlow);
flows.set(hiveSelectedFlow.id, hiveSelectedFlow);
flows.set(commandFlow.id, commandFlow);

export function getFlow(id: string) {
  return flows.get(id);
}

export function registerFlow(flow: ConversationFlow<any>) {
  flows.set(flow.id, flow);
}
