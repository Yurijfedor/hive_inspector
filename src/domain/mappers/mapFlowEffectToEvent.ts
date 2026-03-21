import {FlowEffect} from '../../conversation/types';
import {DomainEvent} from '../events/domainEvents';

export function mapFlowEffectToEvent(effect: FlowEffect): DomainEvent | null {
  switch (effect.type) {
    // -------------------------
    // INSPECTION
    // -------------------------

    case 'STRENGTH_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          strength: effect.payload.strength,
        },
      };

    case 'QUEEN_STATUS_UPDATED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          queen: effect.payload.hasQueen ? 'present' : 'absent',
        },
      };

    case 'HONEY_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          honeyKg: effect.payload.honeyKg,
        },
      };

    case 'FEEDING_RECORDED':
      return {
        type: 'UPDATE_FEEDING',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          syrupLiters: effect.payload.syrupLiters,
        },
      };

    case 'SAVE_INSPECTION':
      return {
        type: 'STOP_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
      };

    // -------------------------
    // SWARM
    // -------------------------

    case 'SWARM_RECORDED':
      return {
        type: 'UPDATE_SWARM',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          queenEmergence: effect.payload.queenEmergence,
          sealedCells: effect.payload.sealedCells,
          openCells: effect.payload.openCells,
          eggsInCells: effect.payload.eggsInCells,
        },
      };

    // -------------------------
    // DISEASE 👈 ДОДАЛИ
    // -------------------------

    case 'DISEASE_RECORDED':
      return {
        type: 'UPDATE_DISEASE',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          disease: effect.payload.disease,
          diarrhea: effect.payload.diarrhea,
          deformedWings: effect.payload.deformedWings,
          mitesVisible: effect.payload.mitesVisible,
          weakBrood: effect.payload.weakBrood,
        },
      };

    case 'SPLIT_RECORDED':
      return {
        type: 'UPDATE_SPLIT',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          isSplit: effect.payload.isSplit,
          usedForSplits: effect.payload.usedForSplits,
          broodFrames: effect.payload.broodFrames,
          foodFrames: effect.payload.foodFrames,
        },
      };

    default:
      return null;
  }
}
