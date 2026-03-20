import {InspectionEvent} from '../../actions/inspectionEvents';
import {SwarmEvent} from './swarmEvents';
import {FeedingEvent} from './feedingEvents';
import {DiseaseEvent} from './diseaseEvents';

// (потім додаси SwarmEvent, FeedingEvent і т.д.)

export type DomainEvent =
  | InspectionEvent
  | SwarmEvent
  | FeedingEvent
  | DiseaseEvent;
