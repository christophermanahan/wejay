import { combineReducers } from 'redux';
import user from './user';
import messages from './chat';
import topTen from './topTen';
import searchResults from './searchResults';
import currentSong from './currentSong';
import parties from './parties';
import currentParty from './currentParty';
import personalQueue from './personalQueue';
import djs from './djs';
import fireboss from './fireboss';
import shadowQueue from './shadowQueue';
import votes from './votes';

const rootReducer = combineReducers({
  fireboss,
  user,
  messages,
  topTen,
  searchResults,
  currentSong,
  parties,
  personalQueue,
  djs,
  currentParty,
  shadowQueue,
  votes
});

export default rootReducer;
