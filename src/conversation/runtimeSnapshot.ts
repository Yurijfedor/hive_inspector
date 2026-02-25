import {InspectionSession} from '../inspection/inspectionSession';

export type RuntimeSnapshot =
  | {mode: 'IDLE'}
  | {mode: 'ACTIVE'; session: InspectionSession}
  | {mode: 'PAUSED'; session: InspectionSession};
