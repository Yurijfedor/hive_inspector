export type VoiceUiState =
  | {
      type: 'IDLE';
    }
  | {
      type: 'WAKE_WORD';
    }
  | {
      type: 'QUESTION';
      text: string;
    }
  | {
      type: 'LISTENING';
    }
  | {
      type: 'PROCESSING';
    }
  | {
      type: 'PROGRESS';
      current: number;
      total: number;
    }
  | {
      type: 'ERROR';
      message: string;
    };
