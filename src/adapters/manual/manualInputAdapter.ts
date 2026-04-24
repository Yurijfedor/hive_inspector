export function mapManualToFlowInput(
  flowId: string,
  data: Record<string, any>,
): string[] {
  switch (flowId) {
    case 'swarm':
      return [
        data.queenEmergence ? 'так' : 'ні',
        data.sealedCells ? 'так' : 'ні',
        data.openCells ? 'так' : 'ні',
        data.eggsInCells ? 'так' : 'ні',
      ];

    case 'disease':
      return [
        data.diarrhea ? 'так' : 'ні',
        data.deformedWings ? 'так' : 'ні',
        data.mitesVisible ? 'так' : 'ні',
        data.weakBrood ? 'так' : 'ні',
      ];

    case 'split':
      return [
        data.isSplit ? 'так' : 'ні',
        data.usedForSplits ? 'так' : 'ні',
        String(data.broodFrames ?? 0),
        'так', // confirm brood
        String(data.foodFrames ?? 0),
        'так', // confirm food
      ];

    default:
      return [];
  }
}
