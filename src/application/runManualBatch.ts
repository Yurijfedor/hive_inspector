import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';

export const runManualBatch = async (hiveNumber: number, data: any) => {
  const events = buildEvents(hiveNumber, data);

  for (const event of events) {
    await handleDomainEvent(event);
  }
};

// 🔥 тимчасово тут (потім винесемо)
const buildEvents = (hiveNumber: number, data: any) => {
  const events: any[] = [];

  if (data.inspection) {
    events.push({
      type: 'INSPECTION_RECORDED',
      hiveNumber,
      payload: data.inspection,
    });
  }

  if (data.swarm) {
    events.push({
      type: 'SWARM_RECORDED',
      hiveNumber,
      payload: data.swarm,
    });
  }

  if (data.disease) {
    events.push({
      type: 'DISEASE_RECORDED',
      hiveNumber,
      payload: data.disease,
    });
  }

  if (data.split) {
    events.push({
      type: 'SPLIT_RECORDED',
      hiveNumber,
      payload: data.split,
    });
  }

  return events;
};
