import {ConversationFlow} from '../inspection/flow/conversationFlow';
import {inspectionFlow} from '../inspection/flow/inspectionDefinition';
import {feedingFlow} from '../inspection/flow/feedingDefinition';
import {hiveSelectionFlow} from '../inspection/flow/hiveDefinition';
import {hiveSelectedFlow} from '../inspection/flow/hiveSelectedDefinition';
import {commandFlow} from '../inspection/flow/commandDefinition';

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
