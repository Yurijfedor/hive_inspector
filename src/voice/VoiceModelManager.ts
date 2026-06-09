import RNFS from 'react-native-fs';

import {VoiceLanguage} from './voiceLanguage';
import {modelFolderNames} from './modelFolderNames';
import {
  ensureModelDirectory,
  getModelPath,
  getTempZipPath,
  ensureTempDirectory,
} from './modelStorage';
import {modelRegistry} from './modelRegistry';
import {downloadFile} from './modelDownloader';

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

  static async prepareModelDirectory(language: VoiceLanguage): Promise<string> {
    const folderName = this.getModelFolderName(language);

    return ensureModelDirectory(folderName);
  }

  static async downloadModel(
    language: VoiceLanguage,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    await ensureTempDirectory();

    const model = modelRegistry[language];

    if (!model) {
      throw new Error(`Unknown language: ${language}`);
    }

    const zipPath = getTempZipPath(language);

    await downloadFile(model.url, zipPath, onProgress);

    return zipPath;
  }
}
