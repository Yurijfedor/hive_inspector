import {parseInspection} from '../src/voice/llm/parseInspection';

const samples = [
  "Вулик номер п'ять, сила вісім, мед три кілограми",
  'Вулик номер 3, матка є',
  'Вулик номер 7, стоп',
  'Вулик номер 2, сила десять',
  'Вулик номер 4',
  'Привіт як справи',
  'Вулик номер пʼять і ще щось придумай',
  '',
  'Меду багато',
];

async function dryRun() {
  for (const text of samples) {
    console.log('VOICE:', text);

    try {
      const result = await parseInspection(text);
      console.log('✅ VALID COMMAND:', result);
    } catch (e) {
      console.error('❌ ERROR:', e);
    }

    console.log('---------------');
  }
}

dryRun();
