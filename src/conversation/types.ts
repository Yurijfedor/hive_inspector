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
      type: 'HONEY_RECORDED';
      payload: {
        hiveNumber: number;
        honeyKg: number;
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
    };

export type FlowInstance = {
  flowId: string;
  session: any;
};
