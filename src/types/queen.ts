import {QUEEN_BREEDS, QUEEN_STATUS} from '../domain/constants/queen';

export type QueenStatus = (typeof QUEEN_STATUS)[keyof typeof QUEEN_STATUS];

export type QueenBreed = (typeof QUEEN_BREEDS)[keyof typeof QUEEN_BREEDS];

export type Queen = {
  status: QueenStatus;

  breed?: QueenBreed;

  birthYear?: number;

  marked?: boolean;

  lastSeenAt?: number;

  updatedAt: number;
};
