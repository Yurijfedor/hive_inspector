import RNFS from 'react-native-fs';

import {VoiceLanguage} from './voiceLanguage';
import {modelFolderNames} from './modelFolderNames';
import {
  ensureModelDirectory,
  getModelPath,
  getTempZipPath,
  ensureTempDirectory,
  findModelRoot,
} from './modelStorage';
import {modelRegistry} from './modelRegistry';
import {downloadFile} from './modelDownloader';

import {installModel as installModelArchive} from './modelInstaller';
// import {findModelRoot} from './modelStorage';

export class VoiceModelManager {
  static async hasModel(language: VoiceLanguage): Promise<boolean> {
    try {
      const installDirectory = this.getInstallDirectory(language);

      await findModelRoot(installDirectory);

      return true;
    } catch {
      return false;
    }
  }

  static async installModel(
    language: VoiceLanguage,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    if (await this.hasModel(language)) {
      return findModelRoot(this.getInstallDirectory(language));
    }

    const installDirectory = await this.prepareModelDirectory(language);

    console.log('📁 MODEL DIRECTORY:', installDirectory);

    const zipPath = await this.downloadModel(language, onProgress);

    console.log('✅ ZIP DOWNLOADED:', zipPath);

    await installModelArchive(zipPath, installDirectory);

    console.log('📦 MODEL UNPACKED');

    const modelPath = await findModelRoot(installDirectory);

    try {
      if (await RNFS.exists(zipPath)) {
        await RNFS.unlink(zipPath);

        console.log('🗑️ ZIP REMOVED');
      }
    } catch (error) {
      console.warn('⚠️ Failed to remove ZIP', error);
    }

    return modelPath;
  }

  private static getInstallDirectory(language: VoiceLanguage): string {
    return getModelPath(modelFolderNames[language]);
  }

  private static async prepareModelDirectory(
    language: VoiceLanguage,
  ): Promise<string> {
    return ensureModelDirectory(modelFolderNames[language]);
  }

  private static async downloadModel(
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
