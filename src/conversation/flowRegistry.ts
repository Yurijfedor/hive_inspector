import {ConversationFlow} from '../inspection/flow/conversationFlow';
import {inspectionFlow} from '../inspection/flow/inspectionDefinition';
import {feedingFlow} from '../inspection/flow/feedingDefinition';

const flows = new Map<string, ConversationFlow<any>>();

flows.set(inspectionFlow.id, inspectionFlow);
flows.set(feedingFlow.id, feedingFlow);

export function getFlow(id: string) {
  return flows.get(id);
}

export function registerFlow(flow: ConversationFlow<any>) {
  flows.set(flow.id, flow);
}
