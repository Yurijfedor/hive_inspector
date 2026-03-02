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

  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  const bus = new EventBus<ConversationEvent>();
  const voice = new MockVoiceAdapter();

  const driver = new ConversationDriver(bus, persistence);

  cleanup = registerVoiceListener(bus, voice, driver);

  await driver.restore();

  return driver;
}

// --------------------------------------------------
// TEST SCENARIO — RESTART DURING RUNNING
// --------------------------------------------------

async function testRestartFlow() {
  let driver = await createApp();

  persistence.onSave = snapshot => {
    console.log('💾 SAVE SNAPSHOT:', JSON.stringify(snapshot, null, 2));

    if (snapshot.mode === 'RUNNING') {
      console.log('\n💥 ===== SIMULATED RESTART ===== 💥\n');

      persistence.onSave = undefined;

      queueMicrotask(async () => {
        driver = await createApp();
      });
    }
  };

  console.log('\n▶ START INSPECTION\n');

  await driver.startFlow('inspection', 12);
}

// async function testNestedFlow() {
//   const driver = await createApp();

//   console.log('\n▶ START INSPECTION\n');

//   await driver.startFlow('inspection', 12);

//   console.log('\n▶ START FEEDING (nested)\n');

//   await driver.startFlow('feeding', 12);
// }
testRestartFlow();
// testNestedFlow();
