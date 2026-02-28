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
    };
