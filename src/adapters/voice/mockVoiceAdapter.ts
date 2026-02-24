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
      '8',
      '',
      '',
      '',
      'продовжити',
      'так',
      '3',
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
      throw new InputStreamClosedError();
    }

    console.log('👤 USER:', answer);
    return answer;
  }
}
