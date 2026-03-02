import {VoiceAdapter} from './VoiceAdapter';

export class InputStreamClosedError extends Error {
  constructor() {
    super('INPUT_STREAM_CLOSED');
  }
}

export class MockVoiceAdapter implements VoiceAdapter {
  private answers: string[];

  constructor(answers?: string[]) {
    this.answers = answers ?? [
      // '50', // invalid strength
      // 'бджоли літають',
      '8', // valid
      'так',
      '12',
      'так',
    ];
  }

  async speak(text: string): Promise<void> {
    console.log('🗣 SYSTEM:', text);
  }

  async listen(): Promise<string> {
    const answer = this.answers.shift();

    if (answer === undefined) {
      console.log('👤 USER: <no more input>');

      // simulate silence instead of crash
      await new Promise(resolve => setTimeout(resolve, 1000));

      return '';
    }

    console.log('👤 USER:', answer);
    return answer;
  }
}
