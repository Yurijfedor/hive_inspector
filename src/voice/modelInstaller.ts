import {unzip} from 'react-native-zip-archive';

export async function installModel(
  zipPath: string,
  destination: string,
): Promise<void> {
  await unzip(zipPath, destination);
}
