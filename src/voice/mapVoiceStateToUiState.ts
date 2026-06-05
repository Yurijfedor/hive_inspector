import {VoiceState} from '../state/voiceState';
import {VoiceUiState} from '../state/voiceUiState';

export function mapVoiceStateToUiState(state: VoiceState): VoiceUiState {
  switch (state.type) {
    case 'LISTENING':
      return {
        type: 'LISTENING',
      };

    case 'PROCESSING':
      return {
        type: 'PROCESSING',
      };

    case 'ERROR':
      return {
        type: 'ERROR',
        message: state.message,
      };

    default:
      return {
        type: 'IDLE',
      };
  }
}
