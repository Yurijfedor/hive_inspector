import {InspectionStepId} from './inspection/inspectionFlow';
import {normalizeBoolean} from '../domain/normalizers/booleanNormalizer';

export function parseAnswer(step: InspectionStepId, value: unknown) {
  const text = String(value).toLowerCase().trim();

  switch (step) {
    case 'STRENGTH': {
      const n = Number(text);
      if (!Number.isFinite(n)) return null;
      return n;
    }

    case 'QUEEN': {
      const answer = normalizeBoolean(value);

      if (answer === true) {
        return 'present';
      }

      if (answer === false) {
        return 'absent';
      }

      return null;
    }

    case 'HONEY': {
      const n = Number(text);
      if (!Number.isFinite(n)) return null;
      return n;
    }

    case 'CONFIRM':
      return normalizeBoolean(value);

    default:
      return null;
  }
}
