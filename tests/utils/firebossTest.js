import { devKeys } from '../../app/utils/publicKeys';

export const config = {
  apiKey: devKeys.FIREBASE_API_KEY,
  authDomain: devKeys.FIREBASE_AUTH_DOMAIN,
  databaseURL: 'ws://127.0.1:5000',
  storageBucket: devKeys.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: devKeys.FIREBASE_MESSAGING_SENDER_ID
};

export const dispatchers = {
  setUser: () => {},
  clearUser: () => {},
  leaveParty: () => {},
  setTopTen: () => {},
  setCurrentSong: () => {},
  setParties: () => {},
  setDjs: () => {},
  setPersonalQueue: () => {},
  setCurrentParty: () => {},
  setShadowQueue: () => {},
  decrementVotes: () => {}

};
