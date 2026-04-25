import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';

export const runManualBatch = async (
  uid: string,
  hiveNumber: number,
  data: any,
) => {
  const events = buildEvents(hiveNumber, data);

  for (const event of events) {
    await handleDomainEvent(uid, event); // ✅ тепер правильно
  }
};

// 🔥 тимчасово тут (потім винесемо)
const buildEvents = (hiveNumber: number, data: any) => {
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
