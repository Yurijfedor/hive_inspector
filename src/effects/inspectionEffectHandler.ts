import {InspectionEvent} from '../actions/inspectionEvents';
import {saveInspection} from '../persistence/inspectionRepository';

export async function handleInspectionEffect(event: InspectionEvent) {
  switch (event.type) {
    case 'STOP_INSPECTION':
      await saveInspection({
        hiveNumber: event.hiveNumber,
        stop: true,
      } as any);
      break;

    case 'UPDATE_INSPECTION':
      await saveInspection({
        hiveNumber: event.hiveNumber,
        ...event.payload,
      } as any);
      break;
  }
}
