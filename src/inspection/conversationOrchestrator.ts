import {
  InspectionSession,
  createInspectionSession,
  applyAnswer,
} from './inspectionSession';

import {inspectionFlow} from './flow/inspectionDefinition';
import {getStep} from './flow/flowRuntime';
import {FlowEffect} from '../conversation/flowEffects';

// --------------------------------------------------
// RESULT TYPES
// --------------------------------------------------

type ConversationFlowResult =
  | {
      type: 'ASK';
      question: string;
      session: InspectionSession;
      effects?: FlowEffect[];
    }
  | {
      type: 'CONFIRM';
      message: string;
      session: InspectionSession;
      effects?: FlowEffect[];
    }
  | {
      type: 'FINISH';
      session: InspectionSession;
      effects?: FlowEffect[];
    }
  | {
      type: 'INVALID';
      message: string;
      session: InspectionSession;
    };

type RuntimeResult =
  | {type: 'PAUSED'; session: InspectionSession}
  | {type: 'IGNORED'};

export type ConversationResult = ConversationFlowResult | RuntimeResult;

// --------------------------------------------------
// TYPE GUARD
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
  const result = applyAnswer(session, value);

  // ✅ STEP VALIDATION FAILED (handled by Flow)
  if (result.type === 'INVALID') {
    return {
      type: 'INVALID',
      message: result.message,
      session: result.session,
    };
  }

  // ✅ TypeScript now knows this is NEXT
  const updatedSession = result.session;
  const effects = result.effects;

  const step = getStep(inspectionFlow, updatedSession.stepIndex);

  // ---------- FLOW FINISHED ----------
  if (!step) {
    return {
      type: 'FINISH',
      session: updatedSession,
      effects,
    };
  }

  // ---------- CONFIRM STEP ----------
  if (step.id === 'CONFIRM') {
    return {
      type: 'CONFIRM',
      message: step.question,
      session: updatedSession,
      effects,
    };
  }

  // ---------- NORMAL QUESTION ----------
  return {
    type: 'ASK',
    question: step.question,
    session: updatedSession,
    effects,
  };
}

// --------------------------------------------------
// START
// --------------------------------------------------

export function startInspectionConversation(
  hiveNumber: number,
): ConversationResult {
  const session = createInspectionSession(hiveNumber);

  const firstStep = getStep(inspectionFlow, session.stepIndex);

  if (!firstStep) {
    return {
      type: 'FINISH',
      session,
    };
  }

  return {
    type: 'ASK',
    question: firstStep.question,
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
