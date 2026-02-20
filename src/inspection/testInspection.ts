import {createInspectionSession} from './inspectionSession';
// import {getCurrentQuestion} from './questionResolver';
import {handleUserAnswer} from './conversationOrchestrator';

// function logStep(session: any) {
//   console.log(
//     'STEP:',
//     session.step,
//     '| QUESTION:',
//     getCurrentQuestion(session),
//   );
// }

const history: any[] = [];

let session = createInspectionSession(5);
history.push(session);
// logStep(session);
// console.log('START:', session);
let result = handleUserAnswer(session, 8);
console.log(result);

session = result.session;

// session = applyAnswer(session, 8);
result = handleUserAnswer(session, 'так');
console.log(result);
history.push(session);
// logStep(session);
// console.log('AFTER STRENGTH:', session);

session = result.session;

result = handleUserAnswer(session, 3);
console.log(result);
history.push(session);
// logStep(session);
// console.log('AFTER QUEEN:', session);

session = result.session;

// session = applyAnswer(session, 3);
history.push(session);
// logStep(session);
// console.log('AFTER HONEY:', session);

console.log('HISTORY:', history);
