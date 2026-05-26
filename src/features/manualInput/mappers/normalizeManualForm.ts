import type {InspectionFormUI, ManualInspectionFormState} from '../types';

import {QUEEN_STATUS} from '../../../domain/constants/queen';

import type {QueenStatus} from '../../../types/queen';

// -------------------------
// helpers
// -------------------------

function toNumber(value: unknown): number {
  const n = Number(value);

  return Number.isNaN(n) ? 0 : n;
}

function normalizeQueenStatus(value: unknown): QueenStatus {
  if (value === true) {
    return QUEEN_STATUS.PRESENT;
  }

  if (value === false) {
    return QUEEN_STATUS.ABSENT;
  }

  if (value === QUEEN_STATUS.PRESENT) {
    return QUEEN_STATUS.PRESENT;
  }

  if (value === QUEEN_STATUS.ABSENT) {
    return QUEEN_STATUS.ABSENT;
  }

  return QUEEN_STATUS.UNKNOWN;
}

// -------------------------
// normalize form
// -------------------------

export function normalizeManualForm(
  form: ManualInspectionFormState,
): InspectionFormUI {
  return {
    // -------------------------
    // inspection
    // -------------------------

    inspection: form.inspection
      ? {
          ...form.inspection,

          strength: toNumber(form.inspection.strength),

          broodFrames: toNumber(form.inspection.broodFrames),

          honeyKg: toNumber(form.inspection.honeyKg),

          queen: normalizeQueenStatus(form.inspection.queen),

          queenYear: toNumber(form.inspection.queenYear),
        }
      : undefined,

    // -------------------------
    // swarm
    // -------------------------

    swarm: form.swarm
      ? {
          queenEmergence: Boolean(form.swarm.queenEmergence),

          sealedCells: Boolean(form.swarm.sealedCells),

          openCells: Boolean(form.swarm.openCells),

          eggsInCells: Boolean(form.swarm.eggsInCells),
        }
      : undefined,

    // -------------------------
    // disease
    // -------------------------

    disease: form.disease
      ? {
          diarrhea: Boolean(form.disease.diarrhea),

          deformedWings: Boolean(form.disease.deformedWings),

          mitesVisible: Boolean(form.disease.mitesVisible),

          weakBrood: Boolean(form.disease.weakBrood),
        }
      : undefined,

    // -------------------------
    // split
    // -------------------------

    split: form.split
      ? {
          isSplit: Boolean(form.split.isSplit),

          usedForSplits: Boolean(form.split.usedForSplits),

          broodFrames: toNumber(form.split.broodFrames) ?? 0,

          foodFrames: toNumber(form.split.foodFrames) ?? 0,
        }
      : undefined,
  };
}
