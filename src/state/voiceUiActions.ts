import {setVoiceUiState} from './voiceUiStateMachine';

export const voiceUiActions = {
  idle() {
    setVoiceUiState({
      type: 'IDLE',
    });
  },

  listening() {
    setVoiceUiState({
      type: 'LISTENING',
    });
  },

  processing() {
    setVoiceUiState({
      type: 'PROCESSING',
    });
  },

  error(message: string) {
    setVoiceUiState({
      type: 'ERROR',
      message,
    });
  },

  question(text: string) {
    setVoiceUiState({
      type: 'QUESTION',
      text,
    });
  },

  // progress(current: number, total: number) {
  //   setVoiceUiState({
  //     type: 'PROGRESS',
  //     current,
  //     total,
  //   });
  // },
};
