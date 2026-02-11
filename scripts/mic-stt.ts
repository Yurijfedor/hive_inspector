// import 'dotenv/config';
// import record from 'node-record-lpcm16';
// import {SpeechClient, protos} from '@google-cloud/speech';

// const client = new SpeechClient({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

// const recognizeStream = client.streamingRecognize({
//   config: {
//     encoding:
//       protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
//     sampleRateHertz: 16000,
//     languageCode: 'uk-UA',
//     enableAutomaticPunctuation: false,
//     speechContexts: [
//       {
//         phrases: [
//           'вулик номер',
//           'сила',
//           'мед',
//           'кілограм',
//           'кг',
//           'нуль',
//           'один',
//           'два',
//           'три',
//           'чотири',
//           'пʼять',
//           'шість',
//           'сім',
//           'вісім',
//           'девʼять',
//         ],
//         boost: 20,
//       },
//     ],
//   },
//   interimResults: true,
// });

// recognizeStream.on('data', response => {
//   for (const result of response.results ?? []) {
//     const text = result.alternatives?.[0]?.transcript;
//     if (!text) continue;

//     if (result.isFinal) {
//       console.log('FINAL:', text);
//     } else {
//       console.log('INTERIM:', text);
//     }
//   }
// });

// recognizeStream.on('error', console.error);

// // 🎤 МІКРОФОН
// const mic = record.record({
//   sampleRateHertz: 16000,
//   threshold: 0,
//   silence: '1.0',
//   recordProgram: 'sox', // windows/mac/linux
//   device: 'default',
//   verbose: false,
// });

// console.log('🎤 Говори…');

// mic.stream().on('data', (data: Buffer) => {
//   recognizeStream.write(data);
// });

// // graceful stop
// process.on('SIGINT', () => {
//   mic.stop();
//   recognizeStream.end();
//   process.exit();
// });

import 'dotenv/config';
import {spawn} from 'node:child_process';
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
  for (const r of response.results ?? []) {
    const t = r.alternatives?.[0]?.transcript;
    if (!t) continue;
    console.log(r.isFinal ? 'FINAL:' : 'INTERIM:', t);
  }
});

recognizeStream.on('error', console.error);

// 🔴 ЗАМІНИ НА СВІЙ МІКРОФОН
const MIC_NAME = 'Микрофон (Realtek(R) Audio)';

const ffmpeg = spawn('ffmpeg', [
  '-f',
  'dshow',
  '-i',
  `audio=${MIC_NAME}`,
  '-ac',
  '1',
  '-ar',
  '16000',
  '-f',
  's16le',
  'pipe:1',
]);

ffmpeg.stdout.on('data', chunk => {
  recognizeStream.write(chunk);
});

ffmpeg.stderr.on('data', () => {}); // ігноруємо лог ffmpeg

process.on('SIGINT', () => {
  ffmpeg.kill('SIGINT');
  recognizeStream.end();
  process.exit();
});

console.log('🎤 Говори…');
