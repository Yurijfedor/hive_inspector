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

  const voice = new MockVoiceAdapter([
    'огляд',
    '8',
    'так',
    'годівля',
    '5',
    'так',
    '12',
    'так',
  ]);

  const driver = new ConversationDriver(bus, persistence);

  cleanup = registerVoiceListener(bus, voice, driver);

  await driver.restore();

  // ⭐ START LISTENING LOOP
  bus.emit({type: 'START_LISTENING'});

  return driver;
}

// --------------------------------------------------
// TEST SCENARIO — INTENT SWITCHING
// --------------------------------------------------

async function testIntentSwitching() {
  await createApp();
}

testIntentSwitching();
