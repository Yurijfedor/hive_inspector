import 'dotenv/config';
import {transcribe} from '../src/voice/stt/transcribe.ts';

(async () => {
  const text = await transcribe('scripts/test-mono.wav');
  console.log('STT RESULT:', text);
})();
