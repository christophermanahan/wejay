import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';
import messages from './chat';
import topTen from './topTen';
import searchResults from './searchResults';
import currentSong from './currentSong';
import parties from './parties';
import currentParty from './currentParty';
import personalQueue from './personalQueue';
import djs from './djs';
import fireboss from './fireboss'

const rootReducer = combineReducers({
  firebase,
  fireboss,
  user,
  messages,
  topTen,
  searchResults,
  currentSong,
  parties,
  personalQueue,
  djs,
  currentParty
});

export default rootReducer;
