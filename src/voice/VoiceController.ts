import {transcribe} from './stt/transcribe';

export async function handleVoiceInput(audioPath: string) {
  const text = await transcribe(audioPath);

  console.log('🎤 STT output:', text);

  // LLM буде завтра
}
