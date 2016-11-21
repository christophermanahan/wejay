import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';
import messages from './chat';
import topTen from './topTen';
import searchResults from './searchResults';
import currentSong from './currentSong';
import parties from './parties';

const rootReducer = combineReducers({
  firebase,
  user,
  messages,
  topTen,
  searchResults,
  currentSong,
  parties
});

export default rootReducer;
