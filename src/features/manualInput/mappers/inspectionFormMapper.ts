import {InspectionFormUI} from '../types';

export function mapInspectionToFlowSequence(data: InspectionFormUI): unknown[] {
  const sequence: unknown[] = [];

  const queen = normalizeQueen(data.queen);

  // STRENGTH
  sequence.push(data.strength);
  sequence.push('так');

  // BROOD
  sequence.push(data.broodFrames);
  sequence.push('так');

  // QUEEN
  sequence.push(queen);

  if (queen === 'так') {
    if (data.queenBreed) {
      sequence.push(data.queenBreed);
    }

    if (data.queenYear) {
      sequence.push(data.queenYear);
    }
  }

  // HONEY
  sequence.push(data.honeyKg);
  sequence.push('так');

  return sequence;
}

function normalizeQueen(value: string): 'так' | 'ні' {
  const v = value.toLowerCase();

  if (v === 'так' || v === 'yes') return 'так';
  if (v === 'ні' || v === 'no') return 'ні';

  throw new Error('Некоректне значення queen');
}
