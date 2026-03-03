export type FlowIntent =
  | {type: 'START_FLOW'; flowId: string; args?: any[]}
  | {type: 'NONE'};

export function detectFlowIntent(text: string): FlowIntent {
  const t = text.trim().toLowerCase();

  if (t.startsWith('годівл')) {
    return {type: 'START_FLOW', flowId: 'feeding'};
  }

  if (t.startsWith('огляд')) {
    return {type: 'START_FLOW', flowId: 'inspection'};
  }

  return {type: 'NONE'};
}
