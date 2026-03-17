export type FlowIntent =
  | {type: 'START_FLOW'; flowId: string; args?: any[]}
  | {type: 'NONE'};

export function detectFlowIntent(text: string): FlowIntent {
  const t = text.trim().toLowerCase();

  if (t.includes('годівл')) {
    return {type: 'START_FLOW', flowId: 'feeding'};
  }

  if (t.includes('огляд')) {
    return {type: 'START_FLOW', flowId: 'inspection'};
  }

  return {type: 'NONE'};
}
