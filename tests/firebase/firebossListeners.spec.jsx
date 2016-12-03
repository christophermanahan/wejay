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
          sampleDjHostId,
          sampleDjHost,
          sampleSong,
          sampleSong2,
          sampleTopTenFull,
          sampleShadowQueue,
          sampleDJsInSingleParty

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
      partiesSpy.restore()
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
    let partyDjsSpy;
    let shadowQueueSpy;
    let personalQueueSpy;

    before('set up parties listener and update party data', done => {
      currentSongSpy = sinon.spy(fireboss.dispatchers, 'setCurrentSong');
      topTenSpy = sinon.spy(fireboss.dispatchers, 'setTopTen');
      partyDjsSpy = sinon.spy(fireboss.dispatchers, 'setDjs');
      shadowQueueSpy = sinon.spy(fireboss.dispatchers, 'setShadowQueue');
      personalQueueSpy = sinon.spy(fireboss.dispatchers, 'setPersonalQueue');
      // let hostId = "abc123";
      // set up current song, top_ten, party_djs, personal queue, shadow queue, user
      fireboss.setUpAllPartyListeners(sampleDjHostId, sampleDjHost)
      done()
      let setUpNewParty = Promise.all([partiesRef.set(sampleParties), userPartiesRef.set({[sampleDjHostId]: sampleDjHostId}), partyDjsRef.set({[sampleDjHostId]: sampleDJsInSingleParty})])

      let addMusicToPartyPlaylists = Promise.all([currentSongRef.child(sampleDjHostId).set(sampleSong), topTenRef.child(sampleDjHostId).set(sampleTopTenFull), shadowQueueRef.child(sampleDjHostId).set(sampleShadowQueue)])

      Promise.all([setUpNewParty, addMusicToPartyPlaylists])
        .then(() => {
          return partyDjsRef.child(sampleParty.id).child(sampleUser.uid).child('personal_queue').set({song1: sampleSong2})
        })
        .then(() => setTimeout(() => done(), 500))
        .catch(done)
    });

    after('turn off parties listener', () => {
      // fireboss.database.ref('parties').off()
    });

    it('setCurrentSong dispatcher has been called once within 500ms', () => {
      expect(currentSongSpy.callCount).to.equal(1)
    });

    it('currentSong dispatcher has been called with correct data', () => {
      expect(currentSongSpy.calledWith(sampleSong)).to.equal(true)
    });

    it('topTen dispatcher has been called once within 500ms', () => {
      expect(currentSongSpy.callCount).to.equal(1)
    });

    it('topTen dispatcher has been called with correct data', () => {
      expect(topTenSpy.calledWith(sampleTopTenFull)).to.equal(true)
    });

    it('shadowQueue dispatcher has been called once within 500ms', () => {
      expect(currentSongSpy.callCount).to.equal(1)
    });

    it('shadowQueue dispatcher has been called with correct data', () => {
      // check child
      expect(topTenSpy.calledWith(sampleShadowQueue)).to.equal(true)
    });

    it('partyDjs dispatcher has been called once within 500ms', () => {
      expect(currentSongSpy.callCount).to.equal(1)
    });



    it('personalQueue dispatcher has been called once within 500ms', () => {
      expect(currentSongSpy.callCount).to.equal(1)
    });



  });


  describe('TESTING END PARTY LISTENER', () => {
    let currentSongSpy;
    let topTenSpy;
    let shadowQueueSpy;
    let Spy;
    let partiesSpy;

    before('set up parties listener and update party data', done => {
      let hostId = "abc123";
      // set up current song, top_ten, party_djs, personal queue, shadow queue, party
      // fireboss.setUpAllPartyListeners()
      // --- THEN: delete the party
      // change current song
      // change top_ten
      // change party_djs
      // change personal queue
      // change shadow queue
      // everything called 1x
      // push to /parties
      done()

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
