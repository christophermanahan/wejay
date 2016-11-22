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
import { setCurrentParty } from './ducks/currentParty';

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);

/* -------------------- ON-ENTER HOOKS ----------------------- */

export const onMainEnter = () => {
  // 1. Set Firebase on Store
  store.dispatch(setFirebase(firebase));

  // 2. Always listen to Party List
  const database = firebase.database();
  database.ref('parties').on('value', snapshot => {
    store.dispatch(setParties(snapshot.val()));
  });

  // 3. Check if user is authenticated
  const auth = firebase.auth();
  auth.onAuthStateChanged(user => {
    if (!user) { // if not authenticated, send to login
      store.dispatch(clearUser());
      browserHistory.push('/login');
    } else { // otherwise, set user on store
      store.dispatch(setUser(user));
      const { uid } = user;

      database.ref('user_parties').child(uid).once('value')
      .then(data => {
        const partyId = data.val();
        if (!partyId) {
          browserHistory.push('/parties'); // user must select party
        } else {

          // get the party stats once
          database.ref('parties').child(partyId).once('value', snapshot => {
            store.dispatch(setCurrentParty(snapshot.val()));
          });

          // set up listeners for state
          database.ref('current_song').child(partyId).on('value', snapshot => {
            store.dispatch(setCurrentSong(snapshot.val()));
          });
          database.ref('top_ten').child(partyId).on('value', snapshot => {
            store.dispatch(setTopTen(snapshot.val()));
          });
          database.ref('party_djs').child(partyId).on('value', snapshot => {
            store.dispatch(setDjs(snapshot.val()));
          });
          database.ref('personal_queue').child(uid).on('value', snapshot => {
            store.dispatch(setPersonalQueue(snapshot.val()));
          });
          database.ref('messages').on('value', snapshot => {
            store.dispatch(setMessages(snapshot.val()));
          });

          browserHistory.push('/app/search');
        }
      })
      .catch(console.error); // TODO: real error handling
    }
  });
};


/*
TODO for UX:

1. When you go back to Login (or parties) and are logged in/in a party, need to change display/given user options
2. Make onRage
3. Make leaveParty button
4. Make Logout button, should also make you leave the party

*/

//onExitParty ==> remove listeners
