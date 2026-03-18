export type SwarmEvent =
  | {
      type: 'UPDATE_SWARM';
      hiveNumber: number;
      payload: {
        hasSwarmSigns?: boolean;
        hasQueenCells?: boolean;
        queenCellsCount?: number;
      };
    }
  | {
      type: 'STOP_SWARM';
      hiveNumber: number;
    };
