import {ConversationDriver} from '../../inspection/conversationDriver';
import {EventBus} from '../../conversation/eventBus';
import {ConversationEvent} from '../../conversation/events';
import {VoiceAdapter} from './VoiceAdapter';

export function registerVoiceListener(
  bus: EventBus<ConversationEvent>,
  voice: VoiceAdapter,
  driver: ConversationDriver,
): () => void {
  const unsubscribeSpeak = bus.on('SYSTEM_SPEAK', e => voice.speak(e.text));

  const unsubscribeListen = bus.on('START_LISTENING', async () => {
    const generation = driver.getGeneration();

    const text = await voice.listen();

    // ⭐ ignore zombie async result
    if (generation !== driver.getGeneration()) {
      console.log('👻 Ignored stale voice result');
      return;
    }

    await driver.handleExternalInput(text);
  });

  // ⭐ cleanup function
  return () => {
    unsubscribeSpeak();
    unsubscribeListen();
  };
}
