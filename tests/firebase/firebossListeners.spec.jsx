const firebase = require('./firebaseTestIndex.spec');

import Fireboss from '../../app/utils/fireboss';
import { expect } from 'chai';
import sinon from 'sinon';

import { dispatchers } from '../utils/firebossTest';
import {
          sampleParty,
          sampleParties,
          sampleDj,
          sampleUser,
          sampleSong,
          sampleSong2,
          sampleTopTenFull

} from '../utils';

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
    let partiesSpy;

    before('set up parties listener and update party data', done => {
      let hostId = "abc123";
      partiesSpy = sinon.spy(fireboss.dispatchers, 'setParties')

      fireboss.createPartiesListener()
      partiesRef.set(sampleParties)
        .then(() => setTimeout(() => done(), 500))
        .catch(done)
    });

    after('turn off parties listener', () => {
      fireboss.database.ref('parties').off()
    });

    it('setParties dispatcher has been called once within 500ms', () => {
      expect(partiesSpy.callCount).to.equal(1)
    });

    it('setParties dispatcher has been called with correct data', () => {
      expect(partiesSpy.calledWithExactly(sampleParties)).to.equal(true)
    });

  });


  describe('TESTING SET UP ALL PARTY LISTENERS', () => {
    let currentSongSpy;
    let topTenSpy;
    let shadowQueueSpy;
    let Spy;
    let partiesSpy;

    before('set up parties listener and update party data', done => {
      let hostId = "abc123";
      done()
      // partiesSpy = sinon.spy(fireboss.dispatchers, 'setParties')

      // fireboss.createPartiesListener()
      // partiesRef.set(sampleParties)
      //   .then(() => setTimeout(() => done(), 500))
      //   .catch(done)
    });

    after('turn off parties listener', () => {
      // fireboss.database.ref('parties').off()
    });

    it('setParties dispatcher has been called once within 500ms', () => {
      // expect(partiesSpy.callCount).to.equal(1)
    });

    it('setParties dispatcher has been called with correct data', () => {
      // expect(partiesSpy.calledWithExactly(sampleParties)).to.equal(true)
    });

  });


});
