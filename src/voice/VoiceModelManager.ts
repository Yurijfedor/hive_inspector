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

import {installModel as installModelArchive} from './modelInstaller';
// import {findModelRoot} from './modelStorage';

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

  static async installModel(
    language: VoiceLanguage,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const modelDirectory = await this.prepareModelDirectory(language);

    console.log('📁 MODEL DIRECTORY:', modelDirectory);

    const localModelPath = await this.getModelPath(language);

    console.log('📂 LOCAL MODEL PATH:', localModelPath);

    const zipPath = await this.downloadModel(language, onProgress);

    console.log('✅ ZIP DOWNLOADED:', zipPath);

    await installModelArchive(zipPath, localModelPath);

    console.log('📦 MODEL UNPACKED');

    const exists = await RNFS.exists(zipPath);

    console.log('📦 ZIP EXISTS:', exists);

    const zipStats = exists ? await RNFS.stat(zipPath) : null;

    console.log('📊 ZIP STATS:', zipStats);

    return `${localModelPath}/vosk-model-small-en-us-0.15`;
  }
}
