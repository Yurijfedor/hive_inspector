import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';
import {updateQueen} from '../domain/repositories/queenRepository';

import type {InspectionFormUI} from '../features/manualInput/types';

export const runManualBatch = async (
  uid: string,
  hiveNumber: number,
  data: InspectionFormUI,
) => {
  // ✅ 1. update queen aggregate
  if (data.inspection?.queen) {
    console.log('🐝 QUEEN DATA:', data.inspection.queen);

    await updateQueen(uid, hiveNumber, {
      status: data.inspection.queen,

      breed: data.inspection.queenBreed,

      birthYear: data.inspection.queenYear,
    });
  }

  // ✅ 2. build events
  const events = buildEvents(hiveNumber, data);

  // ✅ 3. process events
  for (const event of events) {
    await handleDomainEvent(uid, event);
  }
};

// ========================================
// build domain events
// ========================================

const buildEvents = (hiveNumber: number, data: InspectionFormUI) => {
  const events: any[] = [];

  // -------------------------
  // INSPECTION
  // -------------------------

  if (data.inspection) {
    events.push({
      type: 'UPDATE_INSPECTION',

      hiveNumber,

      payload: data.inspection,

      context: {
        source: 'manual',
      },
    });

    events.push({
      type: 'STOP_INSPECTION',

      hiveNumber,

      context: {
        source: 'manual',
      },
    });
  }

  // -------------------------
  // SWARM
  // -------------------------

  if (data.swarm) {
    events.push({
      type: 'UPDATE_SWARM',

      hiveNumber,

      payload: data.swarm,
    });

    events.push({
      type: 'STOP_SWARM',

      hiveNumber,
    });
  }

  // -------------------------
  // DISEASE
  // -------------------------

  if (data.disease) {
    events.push({
      type: 'UPDATE_DISEASE',

      hiveNumber,

      payload: data.disease,
    });

    events.push({
      type: 'STOP_DISEASE',

      hiveNumber,
    });
  }

  // -------------------------
  // SPLIT
  // -------------------------

  if (data.split) {
    events.push({
      type: 'UPDATE_SPLIT',

      hiveNumber,

      payload: data.split,
    });

    events.push({
      type: 'STOP_SPLIT',

      hiveNumber,
    });
  }

  return events;
};
