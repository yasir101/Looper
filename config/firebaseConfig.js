// firebaseConfig.js
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD_IysBjTUCsTrMispvV7ixepjEimQegWU', // Your Web API Key
  authDomain: 'looper-5981f.firebaseapp.com',
  projectId: 'looper-5981f',
  storageBucket: 'looper-5981f.appspot.com',
  messagingSenderId: '1017529723910',
  appId: '1:1017529723910:ios:fcd05e4bd69488c4b3a787', // Your App ID
  // measurementId: 'G-9L7NNF2JW1',  // Omit this line if not using Analytics
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth };
