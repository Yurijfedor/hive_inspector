export type FeedingEvent =
  | {
      type: 'UPDATE_FEEDING';
      hiveNumber: number;
      payload: {
        syrupLiters: number;
      };
    }
  | {
      type: 'STOP_FEEDING';
      hiveNumber: number;
    };
