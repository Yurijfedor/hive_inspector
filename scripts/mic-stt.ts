import 'dotenv/config';
import record from 'node-record-lpcm16';
import {SpeechClient, protos} from '@google-cloud/speech';

const client = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const recognizeStream = client.streamingRecognize({
  config: {
    encoding:
      protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
    sampleRateHertz: 16000,
    languageCode: 'uk-UA',
    enableAutomaticPunctuation: false,
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

recognizeStream.on('data', response => {
  for (const result of response.results ?? []) {
    const text = result.alternatives?.[0]?.transcript;
    if (!text) continue;

    if (result.isFinal) {
      console.log('FINAL:', text);
    } else {
      console.log('INTERIM:', text);
    }
  }
});

recognizeStream.on('error', console.error);

// 🎤 МІКРОФОН
const mic = record.record({
  sampleRateHertz: 16000,
  threshold: 0,
  silence: '1.0',
  recordProgram: 'sox', // windows/mac/linux
  verbose: false,
});

console.log('🎤 Говори…');

mic.stream().on('data', (data: Buffer) => {
  recognizeStream.write(data);
});

// graceful stop
process.on('SIGINT', () => {
  mic.stop();
  recognizeStream.end();
  process.exit();
});
