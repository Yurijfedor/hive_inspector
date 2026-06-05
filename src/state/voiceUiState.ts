export type VoiceUiState =
  | {type: 'IDLE'}
  | {type: 'WAKE_WORD'}
  | {
      type: 'QUESTION';
      text: string;
      current?: number;
      total?: number;
    }
  | {type: 'LISTENING'}
  | {type: 'PROCESSING'}
  | {
      type: 'ERROR';
      message: string;
    };
