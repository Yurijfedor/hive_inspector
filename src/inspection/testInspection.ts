import {createInspectionSession, applyAnswer} from './inspectionSession';
const history: any[] = [];

let session = createInspectionSession(5);
history.push(session);
console.log('START:', session);

session = applyAnswer(session, 8);
history.push(session);
console.log('AFTER STRENGTH:', session);

session = applyAnswer(session, 'так');
history.push(session);
console.log('AFTER QUEEN:', session);

session = applyAnswer(session, 3);
history.push(session);
console.log('AFTER HONEY:', session);

console.log('HISTORY:', history);
