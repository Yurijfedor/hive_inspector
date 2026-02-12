import fs from 'node:fs';
import * as wavDecoder from 'wav-decoder';
import {SpeechClient, protos} from '@google-cloud/speech';

const client = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// 1 секунда PCM для 16 kHz
const LIVE_CHUNK_SIZE = 3200; // ~100 ms
const FILE_CHUNK_SIZE = 16000 * 2; // ~1 секунда

type OnTextCallback = (text: string, isFinal: boolean) => void;
type Mode = 'live' | 'file';

export async function transcribe(
  audioFilePath: string,
  onText?: OnTextCallback,
  mode: Mode = 'file',
): Promise<string> {
  // 1️⃣ WAV → PCM
  const wavBuffer = fs.readFileSync(audioFilePath);
  const audioData = await wavDecoder.decode(wavBuffer);
  const channelData = audioData.channelData[0];

  const pcm16 = Buffer.alloc(channelData.length * 2);
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    pcm16.writeInt16LE(sample * 32767, i * 2);
  }

  return new Promise<string>((resolve, reject) => {
    const recognizeStream = client.streamingRecognize({
      config: {
        encoding:
          protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
            .LINEAR16,
        sampleRateHertz: audioData.sampleRate,
        languageCode: 'uk-UA',
        speechContexts: [
          {
            phrases: [
              'вулик номер',
              'сила',
              'мед',
              'кілограм',
              'кг',
              'нуль',
              'один',
              'два',
              'три',
              'чотири',
              'пʼять',
              'шість',
              'сім',
              'вісім',
              'девʼять',
            ],
            boost: 20,
          },
        ],
      },
      interimResults: mode === 'live',
    });

    const finalParts: string[] = [];

    recognizeStream.on(
      'data',
      (response: protos.google.cloud.speech.v1.StreamingRecognizeResponse) => {
        for (const result of response.results ?? []) {
          const transcript = result.alternatives?.[0]?.transcript;
          if (!transcript) continue;

          onText?.(transcript, Boolean(result.isFinal));

          if (result.isFinal) {
            finalParts.push(transcript);
          }
        }
      },
    );

    recognizeStream.on('error', reject);
    recognizeStream.on('end', () => {
      resolve(finalParts.join(' ').trim());
    });

    // 2️⃣ Надсилання аудіо
    const chunkSize = mode === 'live' ? LIVE_CHUNK_SIZE : FILE_CHUNK_SIZE;

    for (let i = 0; i < pcm16.length; i += chunkSize) {
      recognizeStream.write(pcm16.subarray(i, i + chunkSize));
    }

    recognizeStream.end();
  });
}
