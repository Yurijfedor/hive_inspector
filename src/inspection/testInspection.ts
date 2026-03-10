import {ConversationDriver} from '../conversation/conversationDriver';
// import {MockVoiceAdapter} from '../adapters/voice/mockVoiceAdapter';
import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';
import {registerVoiceListener} from '../adapters/voice/VoiceEventListener';
import {LocalRuntimePersistence} from '../runtime/LocalRuntimePersistence';
import {FirebaseRuntimePersistence} from '../runtime/FirebaseRuntimePersistence';
import {HybridRuntimePersistence} from '../runtime/HybridRuntimePersistence';
import {VoskVoiceAdapter} from '../voice/VoskVoiceAdapter';

export async function runInspectionRuntimeTest(uid: string) {
  console.log('🧪 RUNTIME TEST START');

  const persistence = new HybridRuntimePersistence(
    new LocalRuntimePersistence(),
    new FirebaseRuntimePersistence(uid),
  );

  // const persistence = new LocalRuntimePersistence();

  let cleanup: (() => void) | null = null;

  async function createApp() {
    console.log('🚀 APP BOOT');

    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    const bus = new EventBus<ConversationEvent>();

    const voice = new VoskVoiceAdapter(bus);
    const driver = new ConversationDriver(bus, persistence);

    cleanup = registerVoiceListener(bus, voice, driver);

    await driver.restore();

    return driver;
  }

  const driver = await createApp();

  // ⭐ запуск flow
  await driver.startFlow('inspection', 12);

  await new Promise(r => setTimeout(r, 1500));

  console.log('\n🔁 SIMULATE APP RESTART\n');

  await createApp();
}
