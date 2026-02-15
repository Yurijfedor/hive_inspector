import {parseInspection} from '../src/voice/llm/parseInspection';
import {transcribe} from '../src/voice/stt/transcribe';
import {handleInspection} from '../src/actions/handleInspection';
import {handleInspectionEffect} from '../src/effects/inspectionEffectHandler';

async function dryRun() {
  const text = await transcribe(
    'scripts/test-mono.wav',
    (text, isFinal) => {
      console.log(isFinal ? 'FINAL:' : 'LIVE:', text);
    },
    'live',
  );

  const result = await parseInspection(text);
  const event = await handleInspection(result);
  await handleInspectionEffect(event);

  console.log('✅ EVENT:', event);
  console.log('🔥 EFFECT APPLIED (check Firebase)');
  console.log('---------------');
}

dryRun();
