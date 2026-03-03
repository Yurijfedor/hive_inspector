import {ConversationDriver} from '../../conversation/conversationDriver';
import {EventBus} from '../../conversation/eventBus';
import {ConversationEvent} from '../../conversation/events';
import {VoiceAdapter} from './VoiceAdapter';

export function registerVoiceListener(
  bus: EventBus<ConversationEvent>,
  voice: VoiceAdapter,
  driver: ConversationDriver,
): () => void {
  let active = true;

  const unsubscribeSpeak = bus.on('SYSTEM_SPEAK', e => {
    voice.speak(e.text);
  });

  const unsubscribeListen = bus.on('START_LISTENING', async () => {
    if (!active) return;

    const generation = driver.getGeneration();
    const text = await voice.listen();

    if (!active) return;

    if (generation !== driver.getGeneration()) {
      console.log('👻 Ignored stale voice result');
      return;
    }

    await driver.handleExternalInput(text);
  });

  return () => {
    active = false;
    unsubscribeSpeak();
    unsubscribeListen();
  };
}
