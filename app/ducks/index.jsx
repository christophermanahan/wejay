import { combineReducers } from 'redux';
import firebase from './firebase';
import user from './user';
import auth from './auth';


const rootReducer = combineReducers({
  firebase,
  user,
  auth
});

export default rootReducer;
