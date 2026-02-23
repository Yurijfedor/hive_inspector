import {InspectionStep} from './inspectionFlow';
import {parseAnswer} from './answerValidator';

export type InspectionSession = {
  hiveNumber: number;
  step: InspectionStep;
  data: {
    strength?: number;
    queen?: 'present' | 'absent';
    honeyKg?: number;
  };
};

export const nextStepMap: Record<InspectionStep, InspectionStep> = {
  STRENGTH: 'QUEEN',
  QUEEN: 'HONEY',
  HONEY: 'CONFIRM',
  CONFIRM: 'DONE',
  DONE: 'DONE',
};

export function nextStep(step: InspectionStep): InspectionStep {
  return nextStepMap[step];
}

export function applyAnswer(
  session: InspectionSession,
  value: unknown,
): InspectionSession | null {
  const parsed = parseAnswer(session.step, value);

  // ❗ invalid answer → no transition
  if (parsed === null) {
    return null;
  }

  const newData = {...session.data};

  switch (session.step) {
    case 'STRENGTH':
      newData.strength = parsed as number;
      break;

    case 'QUEEN':
      newData.queen = parsed as 'present' | 'absent';
      break;

    case 'HONEY':
      newData.honeyKg = parsed as number;
      break;

    case 'CONFIRM':
      if (parsed === true) {
        return {
          ...session,
          step: nextStep(session.step),
        };
      }
      return {
        ...session,
        step: 'STRENGTH',
      };
  }

  return {
    ...session,
    data: newData,
    step: nextStep(session.step),
  };
}

export function createInspectionSession(hiveNumber: number): InspectionSession {
  return {
    hiveNumber,
    step: 'STRENGTH',
    data: {},
  };
}
