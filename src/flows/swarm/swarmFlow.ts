export const swarmStepIds = {
  SWARM_SIGNS: true,
  CONFIRM_SWARM_SIGNS: true,

  QUEEN_CELLS: true,
  CONFIRM_QUEEN_CELLS: true,

  QUEEN_CELLS_COUNT: true,
  CONFIRM_QUEEN_CELLS_COUNT: true,

  CONFIRM: true,
} as const;

export type SwarmStepId = keyof typeof swarmStepIds;
