export type QueenEvent =
  | {
      type: 'UPDATE_QUEEN';
      hiveNumber: number;
      payload: {
        status: 'present' | 'absent' | 'unknown';
        breed?: 'карніка' | 'бакфаст' | 'місцева' | 'невідомо';
        birthYear?: number;
        marked?: boolean;
      };
    }
  | {
      type: 'STOP_QUEEN';
      hiveNumber: number;
    };
