export type QueenStatus = 'present' | 'absent' | 'unknown';

export type QueenBreed = 'карніка' | 'бакфаст' | 'місцева' | 'невідомо';

export type Queen = {
  status: QueenStatus;

  breed?: QueenBreed;
  birthYear?: number;
  marked?: boolean;

  lastSeenAt?: number;

  updatedAt: number;
};
