import fs from 'node:fs';
import {SpeechClient, protos} from '@google-cloud/speech';

const client = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const CHUNK_SIZE = 3200; // ~100 ms @ 16kHz mono
const WAV_HEADER_SIZE = 44;

export async function transcribe(audioFilePath: string): Promise<string> {
  // беремо тільки RAW PCM
  const pcmBuffer = fs.readFileSync(audioFilePath).subarray(WAV_HEADER_SIZE);

  return new Promise<string>((resolve, reject) => {
    const recognizeStream = client.streamingRecognize({
      config: {
        encoding:
          protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
            .LINEAR16,
        sampleRateHertz: 16000,
        languageCode: 'uk-UA',
        enableAutomaticPunctuation: false,
        profanityFilter: false,
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
      interimResults: true,
    });

    const parts: string[] = [];

    recognizeStream.on('data', response => {
      for (const result of response.results ?? []) {
        const transcript = result.alternatives?.[0]?.transcript;
        if (!transcript) continue;

        if (result.isFinal) {
          console.log('FINAL:', transcript);
        } else {
          console.log('INTERIM:', transcript);
        }
      }
    });

    recognizeStream.on('error', reject);

    recognizeStream.on('end', () => {
      resolve(parts.join(' ').trim());
    });

    // ❗ ТІЛЬКИ audioContent
    (async () => {
      for (let i = 0; i < pcmBuffer.length; i += CHUNK_SIZE) {
        recognizeStream.write(pcmBuffer.subarray(i, i + CHUNK_SIZE));
      }
      recognizeStream.end();
    })();
  });
}
