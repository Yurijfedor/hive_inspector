export function buildSwarmCommand(hiveNumber: number, data: any) {
  return {
    type: 'SWARM_RECORDED',
    payload: {
      hiveNumber,
      queenEmergence: data.queenEmergence === 'так',
      sealedCells: data.sealedCells === 'так',
      openCells: data.openCells === 'так',
      eggsInCells: data.eggsInCells === 'так',
    },
  };
}
