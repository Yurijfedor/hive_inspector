export type SwarmEvent = {
  type: 'RECORD_SWARM';
  hiveNumber: number;
  payload?: {
    hasSwarmSigns?: boolean;
    hasQueenCells?: boolean;
    queenCellsCount?: number;
  };
};
