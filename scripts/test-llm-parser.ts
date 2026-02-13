import {parseInspection} from '../src/voice/llm/parseInspection';
import {transcribe} from '../src/voice/stt/transcribe';
import {handleInspection} from '../src/actions/handleInspection';

async function dryRun() {
  const text = await transcribe(
    'scripts/test-mono-false.wav',
    (text, isFinal) => {
      console.log(isFinal ? 'FINAL:' : 'LIVE:', text);
    },
    'live',
  );

  const result = await parseInspection(text);
  const action = await handleInspection(result);

  console.log('✅ VALID COMMAND:', result, '=> ACTION:', action);
  console.log('---------------');
}

dryRun();
