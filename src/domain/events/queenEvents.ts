export type QueenPayload = Partial<{
  status: 'present' | 'absent' | 'unknown';
  breed: 'карніка' | 'бакфаст' | 'місцева' | 'невідомо';
  birthYear: number;
  marked: boolean;
}>;

export type QueenEvent =
  | {
      type: 'UPDATE_QUEEN';
      hiveNumber: number;
      payload: QueenPayload;
    }
  | {
      type: 'STOP_QUEEN';
      hiveNumber: number;
    };
