import RNFS from 'react-native-fs';
import {VoiceLanguage} from './voiceLanguage';

export function getModelsRootPath(): string {
  return `${RNFS.DocumentDirectoryPath}/models`;
}

export async function ensureModelsDirectory(): Promise<void> {
  const root = getModelsRootPath();

  const exists = await RNFS.exists(root);

  if (!exists) {
    await RNFS.mkdir(root);
  }
}

export function getModelPath(folderName: string): string {
  return `${getModelsRootPath()}/${folderName}`;
}

export async function ensureModelDirectory(
  folderName: string,
): Promise<string> {
  const modelPath = getModelPath(folderName);

  const exists = await RNFS.exists(modelPath);

  if (!exists) {
    await RNFS.mkdir(modelPath);
  }

  return modelPath;
}

export function getDownloadsPath(): string {
  return `${getModelsRootPath()}/downloads`;
}

export async function ensureDownloadsDirectory(): Promise<void> {
  const path = getDownloadsPath();

  const exists = await RNFS.exists(path);

  if (!exists) {
    await RNFS.mkdir(path);
  }
}

export function getTempDirectory(): string {
  return `${getModelsRootPath()}/temp`;
}

export async function ensureTempDirectory(): Promise<void> {
  const path = getTempDirectory();

  const exists = await RNFS.exists(path);

  if (!exists) {
    await RNFS.mkdir(path);
  }
}

export function getTempZipPath(language: VoiceLanguage): string {
  return `${getTempDirectory()}/${language}.zip`;
}

export async function findModelRoot(installDirectory: string): Promise<string> {
  const entries = await RNFS.readDir(installDirectory);

  const directories = entries.filter((item) => item.isDirectory());

  if (directories.length === 0) {
    throw new Error(`No model directory found inside ${installDirectory}`);
  }

  if (directories.length > 1) {
    throw new Error(
      `Multiple model directories found inside ${installDirectory}`,
    );
  }

  return directories[0].path;
}
