import {InspectionFormUI} from '../types';

import {QUEEN_STATUS} from '../../../domain/constants/queen';

export function mapInspectionToFlowSequence(data: InspectionFormUI): unknown[] {
  const inspection = data.inspection;

  if (!inspection) {
    return [];
  }

  const sequence: unknown[] = [];

  const queen = inspection.queen;

  // -------------------------
  // strength
  // -------------------------

  sequence.push(inspection.strength);

  sequence.push(true);

  // -------------------------
  // brood
  // -------------------------

  sequence.push(inspection.broodFrames);

  sequence.push(true);

  // -------------------------
  // queen
  // -------------------------

  sequence.push(queen);

  if (queen === QUEEN_STATUS.PRESENT) {
    if (inspection.queenBreed) {
      sequence.push(inspection.queenBreed);
    }

    if (inspection.queenYear) {
      sequence.push(inspection.queenYear);
    }
  }

  // -------------------------
  // honey
  // -------------------------

  sequence.push(inspection.honeyKg);

  sequence.push(true);

  return sequence;
}
