import {DomainEvent} from '../events/domainEvents';
import {handleInspectionEffect} from '../../effects/inspectionEffectHandler';
import {handleSwarmEffect} from './swarmEffectHandler';
import {handleFeedingEffect} from './feedingEffectHandler';
import {handleDiseaseEffect} from './diseaseEffectHandler';
import {handleSplitEffect} from './splitEffectHandler';
import {handleTaskEffect} from './taskEffectHandler';
import {handleQueenEffect} from './queenEffectHandler';

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
    // DISEASE
    // -------------------------

    case 'UPDATE_DISEASE':
    case 'STOP_DISEASE':
      return handleDiseaseEffect(uid, event);

    // -------------------------
    // SPLIT
    // -------------------------

    case 'UPDATE_SPLIT':
    case 'STOP_SPLIT':
      return handleSplitEffect(uid, event);

    // ----------------------
    // TASKS
    // ----------------------
    case 'TASKS_CREATED_FROM_AI':
    case 'TASK_COMPLETED':
      return handleTaskEffect(uid, event);

    // -------------------------
    // QUEEN
    // -------------------------

    case 'UPDATE_QUEEN':
    case 'STOP_QUEEN':
      return handleQueenEffect(uid, event);
  }
}
