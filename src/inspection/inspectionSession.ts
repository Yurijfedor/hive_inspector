import {InspectionStep} from './inspectionFlow';

export type InspectionSession = {
  hiveNumber: number;
  step: InspectionStep;
  data: {
    strength?: number;
    queen?: 'present' | 'absent';
    honeyKg?: number;
  };
};

export function nextStep(step: InspectionStep): InspectionStep {
  switch (step) {
    case 'STRENGTH':
      return 'QUEEN';
    case 'QUEEN':
      return 'HONEY';
    case 'HONEY':
      return 'CONFIRM';
    default:
      return 'CONFIRM';
  }
}

export function applyAnswer(
  session: InspectionSession,
  value: any,
): InspectionSession {
  const newData = {...session.data};

  switch (session.step) {
    case 'STRENGTH':
      newData.strength = Number(value);
      break;

    case 'QUEEN':
      newData.queen = value === 'так' ? 'present' : 'absent';
      break;

    case 'HONEY':
      newData.honeyKg = Number(value);
      break;
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
