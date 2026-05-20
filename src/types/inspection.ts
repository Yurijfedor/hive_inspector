import {QueenStatus} from './queen';

import {INSPECTION_SOURCES} from '../domain/constants/inspection';

export type InspectionSource =
  (typeof INSPECTION_SOURCES)[keyof typeof INSPECTION_SOURCES];

export type QueenInput = {
  present: boolean;

  name?: string;

  year?: number;
};

export type Inspection = {
  id: string;

  hiveNumber: number;

  date: number;

  strength: number;

  honeyKg: number;

  broodFrames?: number;

  queen: QueenStatus;

  source: InspectionSource;
};

export type InspectionRaw = {
  createdAt?: number;

  strength?: number;

  honeyKg?: number;

  broodFrames?: number;

  queen?: QueenStatus;

  source?: InspectionSource;
};
