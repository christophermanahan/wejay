import store from './store';
import { setFirebase } from './ducks/firebase';
import firebase from 'firebase';
require('APP/.env.js');

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

const firebaseApp = firebase.initializeApp(config)

export const loadFirebase = () => {
  store.dispatch(setFirebase(firebaseApp))
}
