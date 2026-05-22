import {FlowEffect} from '../../conversation/types';

import {DomainEvent} from '../events/domainEvents';

import {QUEEN_STATUS} from '../constants/queen';

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

    case 'BROOD_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',

        hiveNumber: effect.payload.hiveNumber,

        payload: {
          broodFrames: effect.payload.broodFrames,
        },
      };

    // 🔥 canonical queen status
    case 'QUEEN_STATUS_UPDATED':
      return {
        type: 'UPDATE_INSPECTION',

        hiveNumber: effect.payload.hiveNumber,

        payload: {
          queen: effect.payload.hasQueen
            ? QUEEN_STATUS.PRESENT
            : QUEEN_STATUS.ABSENT,
        },
      };

    case 'UPDATE_QUEEN': {
      const payload = Object.fromEntries(
        Object.entries({
          status: effect.payload.status,

          breed: effect.payload.breed,

          birthYear: effect.payload.birthYear,

          marked: effect.payload.marked,
        }).filter(([, value]) => value !== undefined),
      );

      return {
        type: 'UPDATE_QUEEN',

        hiveNumber: effect.hiveNumber,

        payload,
      };
    }

    case 'HONEY_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',

        hiveNumber: effect.payload.hiveNumber,

        payload: {
          honeyKg: effect.payload.honeyKg,
        },
      };

    // -------------------------
    // FEEDING
    // -------------------------

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
          queenEmergence: effect.payload.queenEmergence ?? false,

          sealedCells: effect.payload.sealedCells ?? false,

          openCells: effect.payload.openCells ?? false,

          eggsInCells: effect.payload.eggsInCells ?? false,
        },
      };

    // -------------------------
    // DISEASE
    // -------------------------

    case 'DISEASE_RECORDED':
      return {
        type: 'UPDATE_DISEASE',

        hiveNumber: effect.payload.hiveNumber,

        payload: {
          disease: effect.payload.disease,

          diarrhea: effect.payload.diarrhea ?? false,

          deformedWings: effect.payload.deformedWings ?? false,

          mitesVisible: effect.payload.mitesVisible ?? false,

          weakBrood: effect.payload.weakBrood ?? false,
        },
      };

    // -------------------------
    // SPLIT
    // -------------------------

    case 'SPLIT_RECORDED':
      return {
        type: 'UPDATE_SPLIT',

        hiveNumber: effect.payload.hiveNumber,

        payload: {
          isSplit: effect.payload.isSplit ?? false,

          usedForSplits: effect.payload.usedForSplits ?? false,

          broodFrames: effect.payload.broodFrames,

          foodFrames: effect.payload.foodFrames,
        },
      };

    default:
      return null;
  }
}
