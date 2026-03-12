import {ConversationDriver} from '../conversation/conversationDriver';
import {VoiceAdapter} from '../adapters/voice/VoiceAdapter';

export class WakeWordController {
  private active = false;

  constructor(
    private driver: ConversationDriver,
    private voice: VoiceAdapter,
    private startWakeWord: () => Promise<void>,
    private stopWakeWord: () => Promise<void>,
  ) {}

  async start() {
    console.log('🐝 WakeWordController started');

    await this.startWakeWord();
  }

  async onWakeWord() {
    if (this.active) return;

    console.log('🐝 WAKE WORD DETECTED');

    this.active = true;

    await this.stopWakeWord();

    await this.driver.startFlow('flow-selector');
    this.active = true;
  }

  async onConversationFinished() {
    console.log('🐝 Conversation finished');

    this.active = false;

    await this.startWakeWord();
  }
}
