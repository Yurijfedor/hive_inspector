import {getVoiceState, setVoiceState} from './voiceStateMachine';

export function confirmLastAction() {
  const state = getVoiceState();

  if (state.type !== 'CONFIRM') return;

  console.log('✅ CONFIRMED:', state.feedback);
  setVoiceState({type: 'IDLE'});
}

export function cancelLastAction() {
  const state = getVoiceState();

  if (state.type !== 'CONFIRM') return;

  console.log('❌ CANCELED:', state.feedback);
  setVoiceState({type: 'IDLE'});
}
