import {InspectionStep} from './inspectionFlow';

export function parseAnswer(step: InspectionStep, value: unknown) {
  const text = String(value).toLowerCase().trim();

  switch (step) {
    case 'STRENGTH': {
      const n = Number(text);
      if (!Number.isFinite(n)) return null;
      return n;
    }

    case 'QUEEN':
      if (text === 'так') return 'present';
      if (text === 'ні') return 'absent';
      return null;

    case 'HONEY': {
      const n = Number(text);
      if (!Number.isFinite(n)) return null;
      return n;
    }

    case 'CONFIRM':
      if (text === 'так') return true;
      if (text === 'ні') return false;
      return null;

    default:
      return null;
  }
}
