import store from './store';
import firebase from 'firebase';
require('APP/.env.js');

import { setFirebase } from './ducks/firebase';
import { setUser } from './ducks/user';
import { setMessages } from './ducks/chat';
import { setTopTen } from './ducks/topTen';
import { setCurrentSong } from './ducks/currentSong';


const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);


/* -------------------- FIREBASE DB STUFF ----------------------- */
const database = firebase.database();

database.ref('messages').on('value', snapshot => {
  store.dispatch(setMessages(snapshot.val()));
});

database.ref('top_ten').on('value', snapshot => {
  store.dispatch(setTopTen(snapshot.val()));
});

database.ref('current_song').on('value', snapshot => {
  store.dispatch(setCurrentSong(snapshot.val()));
});



/* -------------------- FIREBASE AUTH STUFF ----------------------- */

const auth = firebase.auth();
// this will make sure that the current user gets placed in the store if oauth passes
// still need to account for login failures, etc.
auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch(setUser(user));
  }
});

/* -------------------- ON-ENTER HOOKS ----------------------- */

export const loadFirebase = () => {
  store.dispatch(setFirebase(firebase));
};
