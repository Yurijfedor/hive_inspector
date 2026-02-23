import {InspectionSession, createInspectionSession} from './inspectionSession';
import {applyAnswer} from './inspectionSession';
import {getCurrentQuestion} from './questionResolver';

type ConversationFlowResult =
  | {type: 'ASK'; question: string; session: InspectionSession}
  | {type: 'CONFIRM'; message: string; session: InspectionSession}
  | {type: 'FINISH'; session: InspectionSession}
  | {type: 'INVALID'; message: string; session: InspectionSession};

type RuntimeResult =
  | {type: 'PAUSED'; session: InspectionSession}
  | {type: 'IGNORED'};

export type ConversationResult = ConversationFlowResult | RuntimeResult;

export function hasSession(
  result: ConversationResult,
): result is Extract<ConversationResult, {session: InspectionSession}> {
  return 'session' in result;
}

export function handleUserAnswer(
  session: InspectionSession,
  value: unknown,
): ConversationResult {
  const updatedSession = applyAnswer(session, value);

  if (!updatedSession) {
    return {
      type: 'INVALID',
      message: 'Я не зрозумів відповідь. Повторіть, будь ласка.',
      session,
    };
  }

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

export function askCurrentQuestion(
  session: InspectionSession,
): ConversationResult {
  return {
    type: 'ASK',
    question: getCurrentQuestion(session),
    session,
  };
}
