import store from './store';
import firebase from 'firebase';
import { browserHistory } from 'react-router';
import publicKeys from './utils/publicKeys'
import Fireboss from './utils/fireboss'

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
    apiKey: publicKeys.FIREBASE_API_KEY,
    authDomain: publicKeys.FIREBASE_AUTH_DOMAIN,
    databaseURL: publicKeys.FIREBASE_DATABASE_URL,
    storageBucket: publicKeys.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: publicKeys.FIREBASE_MESSAGING_SENDER_ID
  };

firebase.initializeApp(config);



/* -------------------- ON-ENTER HOOKS ----------------------- */

export const onMainEnter = () => {
  // 1. Set Firebase on Store
  store.dispatch(setFirebase(firebase));
  const { fireboss } = store.getState()

  const dispatch = func => {
    return val => store.dispatch(func(val))
  }

  // 2. Always listen to Party List
  fireboss.createPartiesListener(dispatch(setParties))

  // 3. Check if user is authenticated
  const auth = firebase.auth();
  auth.onAuthStateChanged(user => {
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
          fireboss.getCurrentPartySnapshot(partyId, dispatch(setCurrentParty))
          fireboss.createPartyListener(partyId,'current_song', dispatch(setCurrentSong))
          fireboss.createPartyListener(partyId,'top_ten', dispatch(setTopTen))
          fireboss.createPartyListener(partyId,'party_djs', dispatch(setDjs))
          fireboss.createPersonalQueueListener(partyId, user, dispatch(setPersonalQueue))
          fireboss.createMessagesListener(dispatch(setMessages))
          browserHistory.push('/app');
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
