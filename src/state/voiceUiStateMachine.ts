import {VoiceUiState} from './voiceUiState';

let currentState: VoiceUiState = {
  type: 'IDLE',
};

const listeners = new Set<(state: VoiceUiState) => void>();

export function getVoiceUiState() {
  return currentState;
}

export function setVoiceUiState(state: VoiceUiState) {
  currentState = state;

  console.log('🎨 UI STATE:', state.type);

  listeners.forEach((listener) => listener(state));
}

export function subscribeVoiceUiState(listener: (state: VoiceUiState) => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
