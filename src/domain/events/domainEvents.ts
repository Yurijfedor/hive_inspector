import {InspectionEvent} from '../../actions/inspectionEvents';
import {SwarmEvent} from './swarmEvents';

// (потім додаси SwarmEvent, FeedingEvent і т.д.)

export type DomainEvent = InspectionEvent | SwarmEvent;
