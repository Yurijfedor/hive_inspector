import {parseInspection} from '../src/voice/llm/parseInspection';
import {transcribe} from '../src/voice/stt/transcribe';

// const samples = [
//   "Вулик номер п'ять, сила вісім, мед три кілограми",
//   'Вулик номер 3, матка є',
//   'Вулик номер 7, стоп',
//   'Вулик номер 2, сила десять',
//   'Вулик номер 4',
//   'Привіт як справи',
//   'Вулик номер пʼять і ще щось придумай',
//   '',
//   'Меду багато',
// ];

async function dryRun() {
  const text = await transcribe(
    'scripts/test-mono.wav',
    (text, isFinal) => {
      console.log(isFinal ? 'FINAL:' : 'LIVE:', text);
    },
    'live',
  );

  const result = await parseInspection(text);

  console.log('✅ VALID COMMAND:', result);
  console.log('---------------');
}

dryRun();
