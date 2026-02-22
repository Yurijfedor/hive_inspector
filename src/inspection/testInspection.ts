import {ConversationResult} from './conversationOrchestrator';
import {ConversationDriver} from './conversationDriver';

function renderSystem(result: ConversationResult) {
  switch (result.type) {
    case 'ASK':
      return result.question;

    case 'CONFIRM':
      return result.message;

    case 'FINISH':
      return 'Огляд завершено.';
  }
}

const driver = new ConversationDriver();

let result = driver.start(5);
console.log('SYSTEM:', renderSystem(result));

result = driver.handleUserInput(8);
console.log('SYSTEM:', renderSystem(result));

result = driver.handleUserInput('так');
console.log('SYSTEM:', renderSystem(result));

result = driver.handleUserInput(3);
console.log('SYSTEM:', renderSystem(result));
