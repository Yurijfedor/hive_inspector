import {InspectionEvent} from '../../actions/inspectionEvents';
import {SwarmEvent} from './swarmEvents';
import {FeedingEvent} from './feedingEvents';

// (потім додаси SwarmEvent, FeedingEvent і т.д.)

export type DomainEvent = InspectionEvent | SwarmEvent | FeedingEvent;
