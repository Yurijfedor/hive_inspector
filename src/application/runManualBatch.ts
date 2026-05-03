import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';
import {updateQueen} from '../domain/repositories/queenRepository';

export const runManualBatch = async (
  uid: string,
  hiveNumber: number,
  data: any,
) => {
  // ✅ 1. Спочатку оновлюємо queen
  if (data.inspection?.queen) {
    console.log('🐝 QUEEN DATA:', data.inspection.queen);
    await updateQueen(uid, hiveNumber, {
      status: data.inspection.queen.present ? 'present' : 'absent',
      breed: data.inspection.queen.name,
      birthYear: data.inspection.queen.year,
    });
  }

  // ✅ 2. Потім будуємо events
  const events = buildEvents(hiveNumber, data);

  // ✅ 3. Обробляємо events
  for (const event of events) {
    await handleDomainEvent(uid, event);
  }
};

// 🔥 тимчасово тут (потім винесемо)в
const buildEvents = (hiveNumber: number, data: any) => {
  const events: any[] = [];

  // const {queen, ...inspectionWithoutQueen} = data.inspection;
  // console.log(queen);

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
