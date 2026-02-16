import {InspectionEffectResult} from '../effects/types';

export function buildInspectionFeedback(
  result: InspectionEffectResult,
): string {
  switch (result.kind) {
    case 'UPDATED': {
      const parts: string[] = [];

      if (result.payload.strength !== null) {
        parts.push(`сила ${result.payload.strength}`);
      }

      if (result.payload.honeyKg !== null) {
        parts.push(`мед ${result.payload.honeyKg} кілограма`);
      }

      if (result.payload.queen !== null) {
        parts.push(
          `матка ${
            result.payload.queen === 'present'
              ? 'є'
              : result.payload.queen === 'absent'
              ? 'відсутня'
              : 'невідомо'
          }`,
        );
      }

      if (parts.length === 0) {
        return `Вулик ${result.hiveNumber}. Дані без змін.`;
      }

      return `Вулик ${result.hiveNumber}. Записано: ${parts.join(', ')}.`;
    }

    case 'STOPPED':
      return `Огляд вулика ${result.hiveNumber} завершено.`;
  }
}
