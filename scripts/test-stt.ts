import 'dotenv/config';
import {transcribe} from '../src/voice/stt/transcribe';

(async () => {
  const finalText = await transcribe(
    'scripts/test-mono.wav',
    (text, isFinal) => {
      console.log(isFinal ? 'FINAL:' : 'LIVE:', text);
    },
  );

  console.log('====================');
  console.log('STT RESULT:', finalText);
})();
