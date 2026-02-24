import {ConversationDriver} from './conversationDriver';
import {MockVoiceAdapter} from '../adapters/voice/mockVoiceAdapter';

import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';
import {registerVoiceListener} from '../adapters/voice/VoiceEventListener';

// --------------------------------------------------
// BOOTSTRAP (composition root)
// --------------------------------------------------

const bus = new EventBus<ConversationEvent>();

const voice = new MockVoiceAdapter();

const driver = new ConversationDriver(bus);

// connect voice to events
registerVoiceListener(bus, voice, driver);

// --------------------------------------------------
// START CONVERSATION
// --------------------------------------------------

driver.start(5);
