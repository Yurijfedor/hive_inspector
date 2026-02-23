import {VoiceAdapter} from './voiceAdapter';

export class MockVoiceAdapter implements VoiceAdapter {
  private answers = ['8', '', '', '', 'продовжити', 'так', '3', 'так'];
  async speak(text: string): Promise<void> {
    console.log('🗣 SYSTEM:', text);
  }

  async listen(): Promise<string> {
    const answer = this.answers.shift();

    if (answer === undefined) {
      console.log('👤 USER: <no more input>');
      throw new Error('INPUT_STREAM_CLOSED');
    }

    console.log('👤 USER:', answer);
    return answer;
  }
}
