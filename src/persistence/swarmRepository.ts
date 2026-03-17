import {collection, addDoc} from 'firebase/firestore';

export async function saveSwarm(
  uid: string,
  data: {
    hiveNumber: number;
    hasSwarmSigns?: boolean;
    hasQueenCells?: boolean;
    queenCellsCount?: number;
  },
) {
  const ref = collection(db, 'users', uid, 'swarms');

  await addDoc(ref, {
    ...data,
    createdAt: new Date().toISOString(),
  });