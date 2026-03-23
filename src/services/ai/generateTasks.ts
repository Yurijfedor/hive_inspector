import {getFunctions, httpsCallable} from 'firebase/functions';
import {app} from '../../firebase/firebaseApp';

const functions = getFunctions(app, 'us-central1');

export const generateTasks = async (inspections: any[]) => {
  const fn = httpsCallable(functions, 'generateTasks');

  const result = await fn({inspections});

  return result.data;
};
