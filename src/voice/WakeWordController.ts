import {ConversationDriver} from '../conversation/conversationDriver';
import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';

export class WakeWordController {
  private active = false;

  constructor(
    private driver: ConversationDriver,
    private bus: EventBus<ConversationEvent>,
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

    // this.bus.emit({
    //   type: 'SYSTEM_SPEAK',
    //   text: 'Слухаю. Скажіть номер вулика.',
    // });

    await this.driver.startFlow('hive');
  }

  async onConversationFinished() {
    console.log('🐝 Conversation finished');

    this.active = false;

    await this.startWakeWord();
  }
}
