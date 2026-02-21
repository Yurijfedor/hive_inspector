import {
  handleUserAnswer,
  startInspectionConversation,
  ConversationResult,
} from './conversationOrchestrator';

// const history: any[] = [];

// let session = createInspectionSession(5);
// history.push(session);
// let result = handleUserAnswer(session, 8);
// console.log(result);

// session = result.session;

// result = handleUserAnswer(session, 'так');
// console.log(result);
// history.push(session);
// session = result.session;

// result = handleUserAnswer(session, 3);
// console.log(result);
// history.push(session);
// session = result.session;

// history.push(session);

// console.log('HISTORY:', history);

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

let result = startInspectionConversation(5);

console.log('SYSTEM:', renderSystem(result));

let session = result.session;

result = handleUserAnswer(session, 8);
console.log('SYSTEM:', renderSystem(result));

session = result.session;

result = handleUserAnswer(session, 'так');
console.log('SYSTEM:', renderSystem(result));

session = result.session;

result = handleUserAnswer(session, 3);
console.log('SYSTEM:', renderSystem(result));
