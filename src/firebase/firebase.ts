import {initializeApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDgA7VifYqs7BRYFnf2Jz-7fR1jGgBNGRM',
  authDomain: 'hiveinspector-613f8.firebaseapp.com',
  databaseURL:
    'https://hiveinspector-613f8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hiveinspector-613f8',
  storageBucket: 'hiveinspector-613f8.firebasestorage.app',
  messagingSenderId: '985102730017',
  appId: '1:985102730017:web:bcbec65b5d2e2b80247460',
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
