// import {
//   InspectionSession,
//   createInspectionSession,
//   applyAnswer,
// } from '../inspection/inspectionSession';

// import {inspectionFlow} from '../inspection/flow/inspectionDefinition';
// import {getStep} from '../inspection/flow/flowRuntime';
// import {ConversationResult} from './types';

// // --------------------------------------------------
// // TYPE GUARD
// // --------------------------------------------------

// export function hasSession(
//   result: ConversationResult<InspectionSession>,
// ): result is Extract<
//   ConversationResult<InspectionSession>,
//   {session: InspectionSession}
// > {
//   return 'session' in result;
// }

// // --------------------------------------------------
// // USER ANSWER
// // --------------------------------------------------

// export function handleUserAnswer(
//   session: InspectionSession,
//   value: unknown,
// ): ConversationResult<InspectionSession> {
//   const result = applyAnswer(session, value);

//   // ✅ STEP VALIDATION FAILED (handled by Flow)
//   if (result.type === 'INVALID') {
//     return {
//       type: 'INVALID',
//       message: result.message,
//       session: result.session,
//     };
//   }

//   // ✅ TypeScript now knows this is NEXT
//   const updatedSession = result.session;
//   const effects = result.effects;

//   const step = getStep(inspectionFlow, updatedSession.stepIndex);

//   // ---------- FLOW FINISHED ----------
//   if (!step) {
//     return {
//       type: 'FINISH',
//       session: updatedSession,
//       effects,
//     };
//   }

//   // ---------- CONFIRM STEP ----------
//   if (step.id === 'CONFIRM') {
//     return {
//       type: 'CONFIRM',
//       message: step.question,
//       session: updatedSession,
//       effects,
//     };
//   }

//   // ---------- NORMAL QUESTION ----------
//   return {
//     type: 'ASK',
//     question: step.question,
//     session: updatedSession,
//     effects,
//   };
// }

// // --------------------------------------------------
// // START
// // --------------------------------------------------

// export function startInspectionConversation(
//   hiveNumber: number,
// ): ConversationResult<InspectionSession> {
//   const session = createInspectionSession(hiveNumber);

//   const firstStep = getStep(inspectionFlow, session.stepIndex);

//   if (!firstStep) {
//     return {
//       type: 'FINISH',
//       session,
//     };
//   }

//   return {
//     type: 'ASK',
//     question: firstStep.question,
//     session,
//   };
// }

// // --------------------------------------------------
// // RESTORE QUESTION
// // --------------------------------------------------

// export function askCurrentQuestion(
//   session: InspectionSession,
// ): ConversationResult<InspectionSession> {
//   const step = getStep(inspectionFlow, session.stepIndex);

//   if (!step) {
//     return {
//       type: 'FINISH',
//       session,
//     };
//   }

//   return {
//     type: 'ASK',
//     question: step.question,
//     session,
//   };
// }
