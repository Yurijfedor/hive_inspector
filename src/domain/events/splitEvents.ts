export type SplitEvent =
  | {
      type: 'UPDATE_SPLIT';
      hiveNumber: number;
      payload: {
        isSplit?: boolean;
        usedForSplits?: boolean;
        broodFrames?: number;
        foodFrames?: number;
      };
    }
  | {
      type: 'STOP_SPLIT';
      hiveNumber: number;
    };
