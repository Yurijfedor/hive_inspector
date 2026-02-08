// export async function handleVoiceInput(_audioInput: any) {
//   // 1. voice → text (STT)
//   // 2. text → structured command (LLM)
//   // 3. validate command
//   // 4. execute action
// }
import {transcribe} from './stt/transcribe';

export async function handleVoiceInput(audioPath: string) {
  const text = await transcribe(audioPath);

  console.log('🎤 STT output:', text);
}
