import type {QueenBreed, QueenStatus} from '../../types/queen';
import type {HiveContext} from '../../types/hive';

export type InspectionSession = {
  hiveNumber: number;

  stepIndex: number;

  hiveContext?: HiveContext;

  data: {
    strength?: number;

    broodFrames?: number;

    queen?: QueenStatus;

    queenBreed?: QueenBreed;

    queenYear?: number;

    honeyKg?: number;
  };
};
