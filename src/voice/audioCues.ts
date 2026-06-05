import {NativeModules} from 'react-native';

const {AudioCue} = NativeModules;

export const AudioCues = {
  listening() {
    AudioCue?.playBeep?.();
  },

  accepted() {
    AudioCue?.playDoubleBeep?.();
  },

  error() {
    AudioCue?.playErrorBeep?.();
  },
};
