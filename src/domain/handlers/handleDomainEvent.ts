import {DomainEvent} from '../events/domainEvents';
import {handleInspectionEffect} from '../../effects/inspectionEffectHandler';
import {handleSwarmEffect} from './swarmEffectHandler';
import {handleFeedingEffect} from './feedingEffectHandler';
import {handleDiseaseEffect} from './diseaseEffectHandler'; // 👈 ДОДАЛИ

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

    // -------------------------
    // FEEDING
    // -------------------------

    case 'UPDATE_FEEDING':
    case 'STOP_FEEDING':
      return handleFeedingEffect(uid, event);

    // -------------------------
    // DISEASE 👈 НОВЕ
    // -------------------------

    case 'UPDATE_DISEASE':
    case 'STOP_DISEASE':
      return handleDiseaseEffect(uid, event);
  }
}
