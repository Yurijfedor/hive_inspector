import {NativeModules} from 'react-native';

const {BrightnessModule} = NativeModules;

export const enableFieldMode = () => {
  BrightnessModule.enableFieldMode();
};

export const disableFieldMode = () => {
  BrightnessModule.disableFieldMode();
};
