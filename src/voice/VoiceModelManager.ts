import RNFS from 'react-native-fs';

import {VoiceLanguage} from './voiceLanguage';
import {modelFolderNames} from './modelFolderNames';
import {getModelPath} from './modelStorage';

export class VoiceModelManager {
  static getModelFolderName(language: VoiceLanguage): string {
    return modelFolderNames[language];
  }

  static async hasModel(language: VoiceLanguage): Promise<boolean> {
    const folderName = this.getModelFolderName(language);

    const modelPath = getModelPath(folderName);

    return RNFS.exists(modelPath);
  }

  static async getModelPath(language: VoiceLanguage): Promise<string> {
    const folderName = this.getModelFolderName(language);

    return getModelPath(folderName);
  }
}
