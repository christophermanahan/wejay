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

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);


/* -------------------- FIREBASE DB STUFF ----------------------- */
// const database = firebase.database();
//
// database.ref('messages').on('value', snapshot => {
//   store.dispatch(setMessages(snapshot.val()));
// });
//
// database.ref('top_ten').on('value', snapshot => {
//   store.dispatch(setTopTen(snapshot.val()));
// });
//
// database.ref('current_song').on('value', snapshot => {
//   store.dispatch(setCurrentSong(snapshot.val()));
// });
//
// database.ref('parties').on('value', snapshot => {
//   store.dispatch(setParties(snapshot.val()));
// });


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

  if (!uid){
    browserHistory.push('/login');
  }
  //check user id from store, if null, push to login page


  // check for party associated wiht user ID, if null, push to parties page
  const djPartiesRef = firebase.database().ref('djParties')
  djPartiesRef.child(uid).once('value', (data) => {
    console.log("data.val: ", data.val());
  })


  //else set listeners (load current song, load top 10, load DJs --> load DJ pts, load personal queue)




  // const currentPartyId = firebase.database().ref
}



//create listeners here browserhisttory.push--> App

//currentSong --> use partyid
//topTen --> use partyid
//createPersonalQueue(empty) --> user Id
//createDjPoints (set to 0) --> user Id
//listenForDjName --> user Id

//onExitParty ==> remove listeners
