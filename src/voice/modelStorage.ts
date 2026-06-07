import RNFS from 'react-native-fs';

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
