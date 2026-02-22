import {
  startInspectionConversation,
  handleUserAnswer,
  ConversationResult,
} from './conversationOrchestrator';
import {InspectionSession} from './inspectionSession';
import {VoiceAdapter} from '../voice/voiceAdapter';

export class ConversationDriver {
  private session: InspectionSession | null = null;
  private voice: VoiceAdapter;

  constructor(voice: VoiceAdapter) {
    this.voice = voice;
  }

  start(hiveNumber: number): ConversationResult {
    const result = startInspectionConversation(hiveNumber);

    this.session = result.session;

    return result;
  }

  handleUserInput(value: unknown): ConversationResult {
    if (!this.session) {
      throw new Error('Conversation not started');
    }

    const result = handleUserAnswer(this.session, value);

    this.session = result.session;

    return result;
  }

  isActive(): boolean {
    return this.session !== null;
  }

  async run(result: ConversationResult): Promise<void> {
    if (result.type === 'ASK') {
      await this.voice.speak(result.question);

      const transcript = await this.voice.listen();

      const next = this.handleUserInput(transcript);

      return this.run(next);
    }

    if (result.type === 'CONFIRM') {
      await this.voice.speak(result.message);

      const transcript = await this.voice.listen();

      const next = this.handleUserInput(transcript);

      return this.run(next);
    }

    if (result.type === 'FINISH') {
      await this.voice.speak('Огляд завершено.');
      this.session = null;
    }
  }
}
