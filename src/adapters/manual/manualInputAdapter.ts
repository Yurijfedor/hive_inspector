export function mapManualToFlowInput(
  flowId: string,
  data: Record<string, unknown>,
): unknown[] {
  switch (flowId) {
    case 'swarm':
      return [
        Boolean(data.queenEmergence),

        Boolean(data.sealedCells),

        Boolean(data.openCells),

        Boolean(data.eggsInCells),
      ];

    case 'disease':
      return [
        Boolean(data.diarrhea),

        Boolean(data.deformedWings),

        Boolean(data.mitesVisible),

        Boolean(data.weakBrood),
      ];

    case 'split':
      return [
        Boolean(data.isSplit),

        Boolean(data.usedForSplits),

        Number(data.broodFrames ?? 0),

        true, // confirm brood

        Number(data.foodFrames ?? 0),

        true, // confirm food
      ];

    default:
      return [];
  }
}
