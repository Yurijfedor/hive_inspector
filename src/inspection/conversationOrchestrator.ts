import {InspectionSession, createInspectionSession} from './inspectionSession';
import {applyAnswer} from './inspectionSession';
import {getCurrentQuestion} from './questionResolver';

export type ConversationResult =
  | {type: 'ASK'; question: string; session: InspectionSession}
  | {type: 'CONFIRM'; message: string; session: InspectionSession}
  | {type: 'FINISH'; session: InspectionSession};

export function handleUserAnswer(
  session: InspectionSession,
  value: unknown,
): ConversationResult {
  const updatedSession = applyAnswer(session, value);

  if (updatedSession.step === 'CONFIRM') {
    return {
      type: 'CONFIRM',
      message: getCurrentQuestion(updatedSession),
      session: updatedSession,
    };
  }

  if (updatedSession.step === 'DONE') {
    return {
      type: 'FINISH',
      session: updatedSession,
    };
  }

  return {
    type: 'ASK',
    question: getCurrentQuestion(updatedSession),
    session: updatedSession,
  };
}

export function startInspectionConversation(
  hiveNumber: number,
): ConversationResult {
  const session = createInspectionSession(hiveNumber);

  const question = getCurrentQuestion(session);

  return {
    type: 'ASK',
    question,
    session,
  };
}
