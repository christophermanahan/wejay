import store from './store';
import firebase from 'firebase';
import { browserHistory } from 'react-router';
require('APP/.env.js');

import { setFirebase } from './ducks/firebase';
import { setUser, clearUser } from './ducks/user';
import { setMessages } from './ducks/chat';
import { setTopTen } from './ducks/topTen';
import { setCurrentSong } from './ducks/currentSong';
import { setParties } from './ducks/parties';
import { setDjs } from './ducks/djs';
import { setPersonalQueue } from './ducks/personalQueue';

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);


/* ---------------- ALWAYS LISTEN TO PARTY LIST  ------------------- */
const database = firebase.database();

database.ref('parties').on('value', snapshot => {
  store.dispatch(setParties(snapshot.val()));
});


/* -------------------- FIREBASE AUTH STUFF ----------------------- */

const auth = firebase.auth();
// updates store according to user login/logout
// still need to account for login failures, etc.
auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch(setUser(user));
    browserHistory.push('/parties');
  } else {
    store.dispatch(clearUser());
    browserHistory.push('/login');
  }
});


/* -------------------- ON-ENTER HOOKS ----------------------- */

export const loadFirebase = () => {
  store.dispatch(setFirebase(firebase));
};

export const onAppEnter = () => {
  const { uid } = store.getState().user;

  // check user id from store, if null, push to login page
  if (!uid){
    browserHistory.push('/login');
  }

  // check for party associated with user ID, if null, push to parties page
  database.ref('user_parties').child(uid).once('value')
    .then(data => {
      console.log('found user party! setting listeners...')
      const partyId = data.val()
      database.ref('current_song').child(partyId).on('value', snapshot => {
        store.dispatch(setCurrentSong(snapshot.val()));
      });
      database.ref('top_ten').child(partyId).on('value', snapshot => {
        store.dispatch(setTopTen(snapshot.val()));
      });
      database.ref('party_djs').child(partyId).on('value', snapshot => {
        store.dispatch(setDjs(snapshot.val()));
      })
      database.ref('personal_queue').child(uid).on('value', snapshot => {
        store.dispatch(setPersonalQueue(snapshot.val()));
      })
      database.ref('messages').on('value', snapshot => {
        store.dispatch(setMessages(snapshot.val()));
      });
      browserHistory.push('app/chat');
    })
    .catch(err => {
      console.error(err); //TODO real error handling
    })
}

//onExitParty ==> remove listeners
