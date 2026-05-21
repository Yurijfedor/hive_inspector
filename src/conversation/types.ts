import {DiseaseType} from '../domain/constants/disease';
import {QueenStatus, QueenBreed} from '../types/queen';

export type FlowEffect =
  | {
      type: 'STRENGTH_RECORDED';
      payload: {
        hiveNumber: number;
        strength: number;
      };
    }
  | {
      type: 'QUEEN_STATUS_UPDATED';
      payload: {
        hiveNumber: number;
        hasQueen: boolean;
      };
    }
  | {
      type: 'UPDATE_QUEEN';

      hiveNumber: number;

      payload: {
        status: QueenStatus;

        breed?: QueenBreed;

        birthYear?: number;

        marked?: boolean;
      };
    }
  | {
      type: 'HONEY_RECORDED';
      payload: {
        hiveNumber: number;
        honeyKg: number;
      };
    }
  | {
      type: 'BROOD_RECORDED';
      payload: {
        hiveNumber: number;
        broodFrames: number;
      };
    }
  | {
      type: 'SAVE_INSPECTION';
      payload: {
        hiveNumber: number;
      };
    }
  | {
      type: 'FEEDING_RECORDED';
      payload: {
        hiveNumber: number;
        syrupLiters: number;
      };
    }
  | {
      type: 'SWARM_RECORDED';
      payload: {
        hiveNumber: number;
        queenEmergence?: boolean;
        sealedCells?: boolean;
        openCells?: boolean;
        eggsInCells?: boolean;
      };
    }
  | {
      type: 'DISEASE_RECORDED';
      payload: {
        hiveNumber: number;
        disease: DiseaseType;
        diarrhea?: boolean;
        deformedWings?: boolean;
        mitesVisible?: boolean;
        weakBrood?: boolean;
      };
    }
  | {
      type: 'SPLIT_RECORDED';
      payload: {
        hiveNumber: number;
        isSplit?: boolean;
        usedForSplits?: boolean;
        broodFrames?: number;
        foodFrames?: number;
      };
    };

/**
 * Runtime effects handled by ConversationDriver
 */
export type RuntimeEffect =
  | {
      type: 'START_FLOW';
      flowId: string;
      args?: any[];
    }
  | {
      type: 'REPLACE_FLOW';
      flowId: string;
      args?: any[];
    };

export type ConversationFlowResult<TSession> =
  | {
      type: 'ASK';
      question: string;
      session: TSession;
      effects?: FlowEffect[];
      runtimeEffects?: RuntimeEffect[];
    }
  | {
      type: 'CONFIRM';
      message: string;
      session: TSession;
      effects?: FlowEffect[];
      runtimeEffects?: RuntimeEffect[];
    }
  | {
      type: 'FINISH';
      session: TSession;
      effects?: FlowEffect[];
      runtimeEffects?: RuntimeEffect[];
    }
  | {
      type: 'INVALID';
      message: string;
      session: TSession;
    };

export type RuntimeResult = {type: 'IGNORED'};

export type ConversationResult<TSession> =
  | ConversationFlowResult<TSession>
  | RuntimeResult;

export type RuntimeState =
  | {mode: 'IDLE'}
  | {
      mode: 'RUNNING';
      stack: FlowInstance[];
      hiveNumber?: number;
    };

export type FlowInstance = {
  flowId: string;
  session: any;
};
