import RNFS from 'react-native-fs';

export async function downloadFile(
  url: string,
  destination: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  console.log('⬇️ START DOWNLOAD');
  console.log('🌐 URL:', url);
  console.log('💾 DEST:', destination);
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

  console.log(result);

  console.log('📥 JOB ID:', result.jobId);

  await result.promise;

  console.log('✅ DOWNLOAD FINISHED');
}
