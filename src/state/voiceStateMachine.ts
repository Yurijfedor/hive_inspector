import {VoiceState} from './voiceState';

let currentState: VoiceState = {type: 'IDLE'};

const listeners = new Set<(state: VoiceState) => void>();

export function getVoiceState() {
  return currentState;
}

export function setVoiceState(state: VoiceState) {
  currentState = state;

  console.log('🔁 VOICE STATE:', state.type);

  listeners.forEach((listener) => listener(state));
}

export function subscribeVoiceState(listener: (state: VoiceState) => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
