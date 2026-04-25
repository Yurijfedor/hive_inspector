function boolToYesNo(value?: boolean) {
  if (value === undefined) return undefined;
  return value ? 'так' : 'ні';
}

function toNumber(value: any) {
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

export function normalizeManualForm(form: any) {
  return {
    inspection: {
      ...form.inspection,
      strength: toNumber(form.inspection.strength),
      broodFrames: toNumber(form.inspection.broodFrames),
      honeyKg: toNumber(form.inspection.honeyKg),

      queen: boolToYesNo(form.inspection.queen),
    },

    swarm: {
      queenEmergence: boolToYesNo(form.swarm.queenEmergence),
      sealedCells: boolToYesNo(form.swarm.sealedCells),
      openCells: boolToYesNo(form.swarm.openCells),
      eggsInCells: boolToYesNo(form.swarm.eggsInCells),
    },

    disease: {
      diarrhea: boolToYesNo(form.disease.diarrhea),
      deformedWings: boolToYesNo(form.disease.deformedWings),
      mitesVisible: boolToYesNo(form.disease.mitesVisible),
      weakBrood: boolToYesNo(form.disease.weakBrood),
    },

    split: {
      ...form.split,
      isSplit: boolToYesNo(form.split.isSplit),
      usedForSplits: boolToYesNo(form.split.usedForSplits),

      broodFrames: toNumber(form.split.broodFrames),
      foodFrames: toNumber(form.split.foodFrames),
    },
  };
}
