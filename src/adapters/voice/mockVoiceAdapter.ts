import {VoiceAdapter} from './VoiceAdapter';

export class InputStreamClosedError extends Error {
  constructor() {
    super('INPUT_STREAM_CLOSED');
  }
}

export class MockVoiceAdapter implements VoiceAdapter {
  private answers: string[];

  constructor(answers?: string[]) {
    this.answers = answers ?? [];
  }

  async speak(text: string): Promise<void> {
    console.log('🗣 SYSTEM:', text);
  }

  async listen(): Promise<string> {
    const answer = this.answers.shift();

    if (answer === undefined) {
      console.log('👤 USER: <no more input>');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return '';
    }

    console.log('👤 USER:', answer);
    return answer;
  }
}
