import RNFS from 'react-native-fs';

export async function downloadFile(
  url: string,
  destination: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const result = RNFS.downloadFile({
    fromUrl: url,
    toFile: destination,

    progress(data) {
      if (!onProgress) {
        return;
      }

      const progress = data.bytesWritten / data.contentLength;

      onProgress(progress);
    },
  });

  await result.promise;
}
