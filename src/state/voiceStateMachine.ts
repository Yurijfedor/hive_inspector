import {VoiceState} from './voiceState';

let currentState: VoiceState = {type: 'IDLE'};

export function getVoiceState() {
  return currentState;
}

export function setVoiceState(state: VoiceState) {
  currentState = state;
  console.log('🔁 VOICE STATE:', state.type);
}
