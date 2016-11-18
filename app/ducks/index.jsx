import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';


const rootReducer = combineReducers({
  firebase,
  user
});

export default rootReducer;
