import {NativeModules} from 'react-native';

const {VoiceService} = NativeModules;

export const startVoice = () => {
  VoiceService.startService();
};

export const stopVoice = () => {
  VoiceService.stopService();
};
