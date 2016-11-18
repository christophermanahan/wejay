import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';
import messages from './chat'


const rootReducer = combineReducers({
  firebase,
  user,
  messages
});

export default rootReducer;
