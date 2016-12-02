// start firebase test server
import firebase from 'firebase';
import { config } from '../utils/firebossTest';

// initialize firebase app for other firebase tests
firebase.initializeApp(config);

module.exports = firebase;
