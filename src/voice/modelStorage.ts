import RNFS from 'react-native-fs';

export function getModelsRootPath(): string {
  return `${RNFS.DocumentDirectoryPath}/models`;
}

export function getModelPath(folderName: string): string {
  return `${getModelsRootPath()}/${folderName}`;
}
