// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
