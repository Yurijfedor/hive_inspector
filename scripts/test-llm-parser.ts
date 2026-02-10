import {parseInspection} from '../src/voice/llm/parseInspection';

const samples = [
  "Вулик номер п'ять, сила вісім, мед три кілограми",
  'Вулик номер 3, матка є',
  'Вулик номер 7, стоп',
  'Вулик номер 2, сила десять',
  'Вулик номер 4',
];

async function run() {
  for (const text of samples) {
    console.log('VOICE:', text);

    try {
      const result = await parseInspection(text);
      console.log('JSON:', result);
    } catch (e) {
      console.error('❌ ERROR:', e);
    }

    console.log('---------------');
  }
}

run();
