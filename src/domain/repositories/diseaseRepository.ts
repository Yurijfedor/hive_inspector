import database from '@react-native-firebase/database';

export async function saveDisease(
  uid: string,
  data: {
    hiveNumber: number;
    disease?: string;
    diarrhea?: boolean;
    deformedWings?: boolean;
    mitesVisible?: boolean;
    weakBrood?: boolean;
  },
) {
  const updates: Record<string, any> = {};

  const basePath = `users/${uid}/hives/${data.hiveNumber}`;

  // 🔥 агрегований сигнал хвороби
  const hasDiseaseSigns =
    data.diarrhea ||
    data.deformedWings ||
    data.mitesVisible ||
    data.weakBrood ||
    false;

  // 🔹 поточний стан
  updates[`${basePath}/currentDisease`] = {
    ...data,
    hasDiseaseSigns,
    updatedAt: database.ServerValue.TIMESTAMP,
  };

  // 🔹 meta (швидкий доступ)
  updates[`${basePath}/meta/hasDiseaseSigns`] = hasDiseaseSigns;

  updates[`${basePath}/meta/lastDiseaseCheckAt`] =
    database.ServerValue.TIMESTAMP;

  await database().ref().update(updates);
}
