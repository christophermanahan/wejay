import store from './store';
import { setFirebase } from './ducks/firebase';
import { setUser } from './ducks/user';
import { setAuth } from './ducks/auth';

import firebase from 'firebase';
require('APP/.env.js');

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch(setUser(user));
  }
});


export const loadFirebase = () => {
  store.dispatch(setFirebase(firebase));
  store.dispatch(setAuth(auth));
};
