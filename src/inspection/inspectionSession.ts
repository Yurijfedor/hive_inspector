import {inspectionFlow} from './flow/inspectionDefinition';
import {getStep} from './flow/flowRuntime';
import {parseAnswer} from './answerValidator';

export type InspectionSession = {
  hiveNumber: number;
  stepIndex: number;
  data: {
    strength?: number;
    queen?: 'present' | 'absent';
    honeyKg?: number;
  };
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
): InspectionSession | null {
  const step = getStep(inspectionFlow, session.stepIndex);

  // safety guard
  if (!step) {
    return null;
  }

  // validation stays external
  const parsed = parseAnswer(step.id, value);

  // invalid answer → stay on same step
  if (parsed === null) {
    return null;
  }

  // apply transformation defined in FLOW
  const updatedSession = step.apply(session, parsed);

  // move pointer forward
  const nextIndex =
    updatedSession.stepIndex !== session.stepIndex
      ? updatedSession.stepIndex
      : session.stepIndex + 1;

  return {
    ...updatedSession,
    stepIndex: nextIndex,
  };
}
