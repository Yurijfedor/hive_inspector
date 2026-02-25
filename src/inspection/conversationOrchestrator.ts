import {
  InspectionSession,
  createInspectionSession,
  applyAnswer,
} from './inspectionSession';

import {getCurrentQuestion} from './questionResolver';
import {inspectionFlow} from './flow/inspectionDefinition';
import {getStep} from './flow/flowRuntime';

// --------------------------------------------------

type ConversationFlowResult =
  | {type: 'ASK'; question: string; session: InspectionSession}
  | {type: 'CONFIRM'; message: string; session: InspectionSession}
  | {type: 'FINISH'; session: InspectionSession}
  | {type: 'INVALID'; message: string; session: InspectionSession};

type RuntimeResult =
  | {type: 'PAUSED'; session: InspectionSession}
  | {type: 'IGNORED'};

export type ConversationResult = ConversationFlowResult | RuntimeResult;

// --------------------------------------------------

export function hasSession(
  result: ConversationResult,
): result is Extract<ConversationResult, {session: InspectionSession}> {
  return 'session' in result;
}

// --------------------------------------------------
// USER ANSWER
// --------------------------------------------------

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

  // ⭐ беремо крок із FLOW, а не із session
  const step = getStep(inspectionFlow, updatedSession.stepIndex);

  // ---------- FLOW FINISHED ----------
  if (!step) {
    return {
      type: 'FINISH',
      session: updatedSession,
    };
  }

  // ---------- CONFIRM ----------
  if (step.id === 'CONFIRM') {
    return {
      type: 'CONFIRM',
      message: step.question,
      session: updatedSession,
    };
  }

  // ---------- NORMAL ASK ----------
  return {
    type: 'ASK',
    question: step.question,
    session: updatedSession,
  };
}

// --------------------------------------------------
// START
// --------------------------------------------------

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

// --------------------------------------------------
// RESTORE QUESTION
// --------------------------------------------------

export function askCurrentQuestion(
  session: InspectionSession,
): ConversationResult {
  const step = getStep(inspectionFlow, session.stepIndex);

  // якщо flow завершено після restore
  if (!step) {
    return {
      type: 'FINISH',
      session,
    };
  }

  return {
    type: 'ASK',
    question: step.question,
    session,
  };
}
