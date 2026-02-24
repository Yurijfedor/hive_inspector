import {ConversationDriver} from '../../inspection/conversationDriver';
import {EventBus} from '../../conversation/eventBus';
import {ConversationEvent} from '../../conversation/events';
import {VoiceAdapter} from './VoiceAdapter';

export function registerVoiceListener(
  bus: EventBus<ConversationEvent>,
  voice: VoiceAdapter,
  driver: ConversationDriver,
) {
  bus.subscribe(async event => {
    if (event.type === 'SYSTEM_SPEAK') {
      await voice.speak(event.text);
    }

    if (event.type === 'START_LISTENING') {
      const text = await voice.listen();
      driver.handleExternalInput(text);
    }
  });
}
