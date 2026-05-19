export const QUEEN_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  UNKNOWN: 'unknown',
} as const;

export type QueenStatus = (typeof QUEEN_STATUS)[keyof typeof QUEEN_STATUS];

export const QUEEN_BREEDS = {
  BUCKFAST: 'buckfast',
  CARNICA: 'carnica',
  LOCAL: 'local',
  UNKNOWN: 'unknown',
} as const;

export type QueenBreed = (typeof QUEEN_BREEDS)[keyof typeof QUEEN_BREEDS];
