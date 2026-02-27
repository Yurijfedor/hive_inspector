import {inspectionFlow} from './flow/inspectionDefinition';
import {executeStep} from './flow/flowRuntime';
// import {getStep} from './flow/flowRuntime';
// import {parseAnswer} from './answerValidator';

export type InspectionSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    strength?: number;
    queen?: 'present' | 'absent';
    honeyKg?: number;
  };
};

export type ApplyAnswerResult =
  | {
      type: 'INVALID';
      message: string;
      session: InspectionSession;
    }
  | {
      type: 'NEXT';
      session: InspectionSession;
    };

/**
 * Create new inspection session
 */
export function createInspectionSession(hiveNumber: number): InspectionSession {
  return {
    hiveNumber,
    stepIndex: 0,
    data: {},
  };
}

/**
 * Universal declarative applyAnswer (DAY 16)
 */
export function applyAnswer(
  session: InspectionSession,
  value: unknown,
): ApplyAnswerResult {
  const step = inspectionFlow.steps[session.stepIndex];

  const result = executeStep(step, session, value);

  if (result.type === 'RETRY') {
    return {
      type: 'INVALID',
      message: result.message,
      session,
    };
  }

  return {
    type: 'NEXT',
    session: {
      ...result.session,
      stepIndex: session.stepIndex + 1,
    },
  };
}
