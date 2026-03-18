import {DomainEvent} from '../events/domainEvents';
import {handleInspectionEffect} from '../../effects/inspectionEffectHandler';
import {handleSwarmEffect} from './swarmEffectHandler';
// (пізніше додамо swarm)

export async function handleDomainEvent(uid: string, event: DomainEvent) {
  switch (event.type) {
    // -------------------------
    // INSPECTION
    // -------------------------

    case 'UPDATE_INSPECTION':
    case 'STOP_INSPECTION':
      return handleInspectionEffect(uid, event);

    // -------------------------
    // SWARM
    // -------------------------

    case 'UPDATE_SWARM':
    case 'STOP_SWARM':
      return handleSwarmEffect(uid, event);
  }
}
