import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';
import messages from './chat'
import topTen from './topTen'


const rootReducer = combineReducers({
  firebase,
  user,
  messages,
  topTen
});

export default rootReducer;
