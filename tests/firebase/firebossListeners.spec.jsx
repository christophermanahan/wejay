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

describe('---------- FIREBOSS LISTENER TESTS ----------', () => {

  describe('TESTING GLOBAL PARTIES LISTENER', () => {
    before('set up parties listener', done => {
      // fireboss.createPartiesListener()
      // firebase.addParty()
      // set Timeout?
    });

    after('turn off parties listener', done => {
      // fireboss.database.ref('parties').off()
    });

    it('parties dispatcher', () => {
      // expect spy dispatcher in listener to have been called within 1 second
      // expect spy dispatcher in listener to have been called with new parties obj
    });

  });


});
