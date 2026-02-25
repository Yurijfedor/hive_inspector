import {ConversationDriver} from './conversationDriver';
import {MockVoiceAdapter} from '../adapters/voice/mockVoiceAdapter';

import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';
import {registerVoiceListener} from '../adapters/voice/VoiceEventListener';

import {MockRuntimePersistence} from '../conversation/mockRuntimePersistence';

// --------------------------------------------------
// GLOBAL PERSISTENCE (survives restart)
// --------------------------------------------------

const persistence = new MockRuntimePersistence();

// --------------------------------------------------
// RUNTIME LIFECYCLE CONTROL ⭐
// --------------------------------------------------

let cleanup: (() => void) | null = null;

// --------------------------------------------------
// APP FACTORY (simulates real app boot)
// --------------------------------------------------

async function createApp(): Promise<ConversationDriver> {
  console.log('🚀 APP BOOT');

  // 🔥 destroy previous runtime completely
  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  const bus = new EventBus<ConversationEvent>();
  const voice = new MockVoiceAdapter();

  const driver = new ConversationDriver(bus, persistence);

  // register adapters and KEEP cleanup reference
  cleanup = registerVoiceListener(bus, voice, driver);

  // restore previous runtime state
  await driver.restore();

  return driver;
}

// --------------------------------------------------
// TEST SCENARIO
// --------------------------------------------------

async function testRestartFlow() {
  let driver = await createApp();

  // restart exactly after first ACTIVE snapshot
  persistence.onSave = snapshot => {
    if (snapshot.mode === 'ACTIVE') {
      console.log('\n💥 ===== SIMULATED RESTART ===== 💥\n');

      // avoid infinite restart loop
      persistence.onSave = undefined;

      // ⭐ simulate real OS restart
      // (restart AFTER current execution finishes)
      queueMicrotask(async () => {
        driver = await createApp();
      });
    }
  };

  await driver.start(5);
}

testRestartFlow();
