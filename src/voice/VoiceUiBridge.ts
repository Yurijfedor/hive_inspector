// import {subscribeVoiceState} from '../state/voiceStateMachine';

// import {setVoiceUiState} from '../state/voiceUiStateMachine';

// import {mapVoiceStateToUiState} from './mapVoiceStateToUiState';

// let unsubscribe: (() => void) | null = null;

// export function startVoiceUiBridge() {
//   if (unsubscribe) {
//     return;
//   }

//   unsubscribe = subscribeVoiceState((state) => {
//     setVoiceUiState(mapVoiceStateToUiState(state));
//   });
// }

// export function stopVoiceUiBridge() {
//   unsubscribe?.();

//   unsubscribe = null;
// }
