const firebase = require('./firebaseTestIndex.spec');

import Fireboss from '../../app/utils/fireboss';
import { expect } from 'chai';

import { dispatchers } from '../utils/firebossTest';
import {
          sampleParty,
          sampleDj,
          sampleUser,
          sampleSong,
          sampleSong2,
          sampleTopTenFull

} from '../utils';

const spyDispatchers = {
  setUser: val => {},
  clearUser: val => {},
  leaveParty: val => {},
  setTopTen: val => {},
  setCurrentSong: val => {},
  setParties: val => {},
  setDjs: val => {},
  setPersonalQueue: val => {},
  setCurrentParty: val => {},
  setShadowQueue: val => {}
};

const browserHistory = [];

const fireboss = new Fireboss(firebase, dispatchers, browserHistory);

// create spy dispatchers
// make sure they are called with the right data

describe('------ FIREBOSS LISTENER TESTS ------', () => {

  let partiesRef = firebase.database().ref('parties')
  let userPartiesRef = firebase.database().ref('user_parties')
  let partyDjsRef = firebase.database().ref('party_djs')
  let currentSongRef = firebase.database().ref('current_song')
  let topTenRef = firebase.database().ref('top_ten')
  let shadowQueueRef = firebase.database().ref('shadow_queue')

  describe('TESTING GLOBAL PARTIES LISTENER', () => {
    before('set up parties listener', done => {
      let hostId = "abc123";
      fireboss.createPartiesListener()
        .then(() => {
          return partiesRef.set({[hostId]: sampleParty})
        })
        .then(() => {
          setTimeout(() => done(), 500)
        })
        .catch(done)
    });

    after('turn off parties listener', done => {
      fireboss.database.ref('parties').off()
        .then(() => done())
        .catch(done)
    });

    it('parties dispatcher', () => {
      // expect spy dispatcher in listener to have been called within 1 second
      // expect spy dispatcher in listener to have been called with new parties obj
    });

  });


});
