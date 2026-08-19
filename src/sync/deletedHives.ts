import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'deleted_hives';

async function loadDeletedHives(): Promise<number[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (hiveNumber) =>
        typeof hiveNumber === 'number' && Number.isFinite(hiveNumber),
    );
  } catch (e) {
    console.log('❌ PARSE DELETED HIVES FAILED:', e);
    return [];
  }
}

export async function markHiveDeleted(hiveNumber: number): Promise<void> {
  const deletedHives = await loadDeletedHives();

  if (deletedHives.includes(hiveNumber)) {
    return;
  }

  const next = [...deletedHives, hiveNumber];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  console.log('🗑️ HIVE MARKED FOR CLOUD DELETE:', hiveNumber);
}

export async function getDeletedHives(): Promise<number[]> {
  return loadDeletedHives();
}

export async function unmarkHiveDeleted(hiveNumber: number): Promise<void> {
  const deletedHives = await loadDeletedHives();

  const next = deletedHives.filter((item) => item !== hiveNumber);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  console.log('✅ HIVE DELETE MARKER REMOVED:', hiveNumber);
}
