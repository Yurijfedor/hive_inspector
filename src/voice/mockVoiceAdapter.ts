import {VoiceAdapter} from './voiceAdapter';

export class MockVoiceAdapter implements VoiceAdapter {
  private answers = ['8', 'так', '3', 'так'];

  async speak(text: string): Promise<void> {
    console.log('🗣 SYSTEM:', text);
  }

  async listen(): Promise<string> {
    const answer = this.answers.shift() ?? '';
    console.log('👤 USER:', answer);
    return answer;
  }
}
