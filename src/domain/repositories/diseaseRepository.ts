import database from '@react-native-firebase/database';

import type {DiseaseType} from '../../types/disease';

export async function saveDisease(
  uid: string,

  data: {
    hiveNumber: number;

    disease?: DiseaseType;

    diarrhea?: boolean;

    deformedWings?: boolean;

    mitesVisible?: boolean;

    weakBrood?: boolean;
  },
) {
  const updates: Record<string, unknown> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔥 aggregated disease signal
  const hasDiseaseSigns =
    data.diarrhea === true ||
    data.deformedWings === true ||
    data.mitesVisible === true ||
    data.weakBrood === true;

  // -------------------------
  // current disease state
  // -------------------------
  updates[`${basePath}/currentDisease`] = {
    disease: data.disease ?? null,

    diarrhea: data.diarrhea ?? false,

    deformedWings: data.deformedWings ?? false,

    mitesVisible: data.mitesVisible ?? false,

    weakBrood: data.weakBrood ?? false,

    hasDiseaseSigns,

    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // -------------------------
  // meta
  // -------------------------
  updates[`${basePath}/meta/hasDiseaseSigns`] = hasDiseaseSigns;

  updates[`${basePath}/meta/lastDiseaseCheckAt`] =
    database.ServerValue.TIMESTAMP;

  updates[`${basePath}/meta/currentDiseaseType`] = data.disease ?? null;

  await database().ref().update(updates);
}
