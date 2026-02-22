import {ConversationDriver} from './conversationDriver';
import {MockVoiceAdapter} from '../voice/mockVoiceAdapter';

const voice = new MockVoiceAdapter();
const driver = new ConversationDriver(voice);

const startResult = driver.start(5);

driver.run(startResult);
