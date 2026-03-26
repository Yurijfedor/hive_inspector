import {InspectionEvent} from '../../actions/inspectionEvents';
import {SwarmEvent} from './swarmEvents';
import {FeedingEvent} from './feedingEvents';
import {DiseaseEvent} from './diseaseEvents';
import {SplitEvent} from './splitEvents';
import {TaskEvent} from './taskEvents';

// (потім додаси SwarmEvent, FeedingEvent і т.д.)

export type DomainEvent =
  | InspectionEvent
  | SwarmEvent
  | FeedingEvent
  | DiseaseEvent
  | SplitEvent
  | TaskEvent;
