export function buildDiseaseCommand(hiveNumber: number, data: any) {
  return {
    type: 'DISEASE_RECORDED',
    payload: {
      hiveNumber,
      diarrhea: data.diarrhea === 'так',
      deformedWings: data.deformedWings === 'так',
      mitesVisible: data.mitesVisible === 'так',
      weakBrood: data.weakBrood === 'так',
    },
  };
}
