export function buildInspectionCommand(hiveNumber: number, data: any) {
  return {
    type: 'INSPECTION_RECORDED',
    payload: {
      hiveNumber,
      strength: data.strength,
      broodFrames: data.broodFrames,
      honeyKg: data.honeyKg,

      queen: data.queen === 'так' ? 'present' : 'absent',

      queenBreed: data.queenBreed,
      queenYear: data.queenYear,
    },
  };
}
