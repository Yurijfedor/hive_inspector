import {NativeModules} from 'react-native';

const {Vosk} = NativeModules;

export async function loadVoiceModel(path: string) {
  return Vosk.loadModel(path);
}
