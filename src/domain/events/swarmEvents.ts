export type SwarmEvent =
  | {
      type: 'UPDATE_SWARM';
      hiveNumber: number;
      payload: {
        queenEmergence?: boolean;
        sealedCells?: boolean;
        openCells?: boolean;
        eggsInCells?: boolean;
      };
    }
  | {
      type: 'STOP_SWARM';
      hiveNumber: number;
    };
