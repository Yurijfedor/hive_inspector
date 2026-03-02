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
  let listening = false;

  // ---------------- SPEAK ----------------

  const unsubscribeSpeak = bus.on('SYSTEM_SPEAK', e => {
    voice.speak(e.text);
  });

  // ---------------- STOP ON FINISH ----------------

  const unsubscribeFinish = bus.on('CONVERSATION_FINISHED', () => {
    active = false;
  });

  // ---------------- LISTEN LOOP ----------------

  async function listenLoop() {
    if (listening) return; // prevent parallel loops
    listening = true;

    while (active) {
      const generation = driver.getGeneration();

      try {
        const text = await voice.listen();

        if (!active) continue;

        // ignore stale async result
        if (generation !== driver.getGeneration()) {
          console.log('👻 Ignored stale voice result');
          continue;
        }

        await driver.handleExternalInput(text);
      } catch (e) {
        // input stream closed → just retry
        continue;
      }
    }

    listening = false;
  }

  const unsubscribeListen = bus.on('START_LISTENING', () => {
    if (!active) return;
    listenLoop();
  });

  // ---------------- CLEANUP ----------------

  return () => {
    active = false;
    unsubscribeSpeak();
    unsubscribeListen();
    unsubscribeFinish();
  };
}
