import store from './store';
import firebase from 'firebase';
import { browserHistory } from 'react-router';
import publicKeys from './utils/publicKeys';
import Fireboss from './utils/fireboss';

import { setFirebase } from './ducks/firebase';
import { setFireboss } from './ducks/fireboss';
import { setUser, clearUser } from './ducks/user';
import { leaveParty } from './ducks/global';
import { setTopTen } from './ducks/topTen';
import { setCurrentSong } from './ducks/currentSong';
import { setParties } from './ducks/parties';
import { setDjs } from './ducks/djs';
import { setPersonalQueue } from './ducks/personalQueue';
import { setCurrentParty } from './ducks/currentParty';
import { setShadowQueue } from './ducks/shadowQueue';


const config = {
    apiKey: publicKeys.FIREBASE_API_KEY,
    authDomain: publicKeys.FIREBASE_AUTH_DOMAIN,
    databaseURL: publicKeys.FIREBASE_DATABASE_URL,
    storageBucket: publicKeys.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: publicKeys.FIREBASE_MESSAGING_SENDER_ID
  };


const dispatch = func => {
  return val => store.dispatch(func(val));
}

const dispatchers = {
  setUser: dispatch(setUser),
  clearUser: dispatch(clearUser),
  leaveParty: dispatch(leaveParty),
  setTopTen: dispatch(setTopTen),
  setCurrentSong: dispatch(setCurrentSong),
  setParties: dispatch(setParties),
  setDjs: dispatch(setDjs),
  setPersonalQueue: dispatch(setPersonalQueue),
  setCurrentParty: dispatch(setCurrentParty),
  setShadowQueue: dispatch(setShadowQueue)
}

firebase.initializeApp(config);


/* -------------------- ON-ENTER HOOKS ----------------------- */

export const onMainEnter = () => {
  // 1. Set Firebase on Store
  store.dispatch(setFirebase(firebase));
  const fireboss = new Fireboss(firebase, dispatchers, browserHistory)
  store.dispatch(setFireboss(fireboss))




  // 2. Always listen to Party List
  fireboss.createPartiesListener();

  // 3. Check if user is authenticated
  fireboss.auth.onAuthStateChanged(user => {
    if (!user) { // if not authenticated, send to login
      store.dispatch(clearUser());
      browserHistory.push('/login');
    }
    else { // otherwise, set user on store
      store.dispatch(setUser(user));

      fireboss.checkingUserParty(user)
      .then(data => {
        const partyId = data.val();
        if (!partyId) {
          browserHistory.push('/parties'); // user must select party
        } else {

          // set typical party listeners
          fireboss.getCurrentPartySnapshot(partyId);
          fireboss.createPartyListener(partyId, 'current_song');
          fireboss.createPartyListener(partyId, 'top_ten');
          fireboss.createPartyListener(partyId, 'party_djs');
          fireboss.endPartyListener(partyId, user);
          fireboss.createPersonalQueueListener(partyId, user);
          fireboss.createShadowQueueListener(partyId, user);
          browserHistory.push('/app');
        }
      })
      .catch(console.error); // TODO: real error handling
    }
  });
};

