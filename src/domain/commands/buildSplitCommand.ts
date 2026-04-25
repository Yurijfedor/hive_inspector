export function buildSplitCommand(hiveNumber: number, data: any) {
  return {
    type: 'SPLIT_RECORDED',
    payload: {
      hiveNumber,
      isSplit: data.isSplit === 'так',
      usedForSplits: data.usedForSplits === 'так',
      broodFrames: data.broodFrames,
      foodFrames: data.foodFrames,
    },
  };
}
