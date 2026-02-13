import {parseInspection} from './llm/parseInspection';
import {transcribe} from './stt/transcribe';
import {handleInspection} from '../actions/handleInspection';

export async function handleVoiceInput(audioPath: string) {
  const text = await transcribe(
    audioPath,
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
