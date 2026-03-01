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

  // ---------------- SPEAK ----------------

  const unsubscribeSpeak = bus.on('SYSTEM_SPEAK', e => voice.speak(e.text));

  // ---------------- STOP ON FINISH ----------------

  const unsubscribeFinish = bus.on('CONVERSATION_FINISHED', () => {
    active = false;
  });

  // ---------------- LISTEN LOOP ----------------

  const unsubscribeListen = bus.on('START_LISTENING', async () => {
    if (!active) return;

    const generation = driver.getGeneration();

    try {
      const text = await voice.listen();

      // ignore zombie async result
      if (!active) return;

      if (generation !== driver.getGeneration()) {
        console.log('👻 Ignored stale voice result');
        return;
      }

      await driver.handleExternalInput(text);
    } catch (e) {
      // stream closed → silently stop
      return;
    }
  });

  // ---------------- CLEANUP ----------------

  return () => {
    active = false;
    unsubscribeSpeak();
    unsubscribeListen();
    unsubscribeFinish();
  };
}
