import {ConversationDriver} from '../conversation/conversationDriver';
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
// RUNTIME LIFECYCLE CONTROL
// --------------------------------------------------

let cleanup: (() => void) | null = null;

// --------------------------------------------------
// APP FACTORY
// --------------------------------------------------

async function createApp(): Promise<ConversationDriver> {
  console.log('🚀 APP BOOT');

  // destroy previous runtime
  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  const bus = new EventBus<ConversationEvent>();
  const voice = new MockVoiceAdapter();

  const driver = new ConversationDriver(bus, persistence);

  cleanup = registerVoiceListener(bus, voice, driver);

  // ⭐ restore runtime state
  await driver.restore();

  return driver;
}

// --------------------------------------------------
// TEST SCENARIO
// --------------------------------------------------

async function testRestartFlow() {
  let driver = await createApp();

  // simulate OS kill right after ACTIVE snapshot
  persistence.onSave = snapshot => {
    console.log('💾 SAVE SNAPSHOT:', snapshot);

    if (snapshot.mode === 'ACTIVE') {
      console.log('\n💥 ===== SIMULATED RESTART ===== 💥\n');

      persistence.onSave = undefined;

      queueMicrotask(async () => {
        driver = await createApp();
      });
    }
  };

  console.log('\n▶ START INSPECTION\n');

  await driver.start('inspection', 12);
}

testRestartFlow();
