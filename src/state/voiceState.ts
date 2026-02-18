export type VoiceState =
  | {type: 'IDLE'}
  | {type: 'LISTENING'}
  | {type: 'PROCESSING'}
  | {
      type: 'CONFIRM';
      pendingCommand: any;
      feedback: string;
    }
  | {
      type: 'ERROR';
      message: string;
    };
