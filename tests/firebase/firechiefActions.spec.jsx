import firebase from 'firebase';
import Firechief from '../../app/utils/firechief';
import { expect } from 'chai';

import { config } from '../utils/firebossTest';

import {  } from '../utils';

// initialize test firebase server
firebase.initializeApp(config);

const db = firebase.database();

const firechief = new Firechief(db);

describe('---------- FIRECHIEF TESTS ----------', () => {

	// setCurrentSong
	// pullFromShadowQueue
	// pullFromPersonalQueue

  describe('setCurrentSong function', () => {
    let partiesRef = firebase.database().ref('parties');
    let userPartiesRef = firebase.database().ref('user_parties');
    let partyDjsRef = firebase.database().ref('party_djs');
    let topTenRef = firebase.database().ref('top_ten');
    let shadowQueueRef = firebase.database().ref('top_ten');
    // let personalQueueRef1 = firebase.database().ref('party_djs').child(###SOME PARTY ID###).child(##SOME UID##).child('personal_queue')


    let hostId = samplePartyHostId;
    let partyId = hostId;

    before('Set up a party with a full queues and some DJs', done => {
      const setUpParty = [partiesRef.set({[hostId]: sampleParty}),
                          userPartiesRef.set({[hostId]: hostId}),
                          partyDjsRef.set({[hostId]: {[hostId]: sampleDj}})]

      Promise.all(setUpParty)
        .then(() => {
          return fireboss.joinParty(partyId, sampleUser)
        })
        .then(() => {
          return Promise.all([partiesRef.once('value'), userPartiesRef.once('value'), partyDjsRef.once('value')])
        })
        .then(resultsArr => {
          partiesResult = resultsArr[0].val();
          userPartiesResult = resultsArr[1].val();
          partyDjsResult = resultsArr[2].val();
          done()
        })
        .catch(done)
    });

    after('destroy everything', done => {
      // fireboss.removePartyListeners(partyId, sampleUser)
      //   .then(() => {
      //     return Promise.all([partiesRef.set({}), userPartiesRef.set({}), partyDjsRef.set({})])
      //   })
      //   .then(() => {
      //     done()
      //   })
      //   .catch(done)
    });

    it('gets highest priority song from Top Ten and sets it to Current Song', () => {
      console.log('test shit')
    });

    it('updates need song to false', () => {
      console.log('test shit')
    });

    it('removes song from Top Ten', () => {
      console.log('test shit')
    });



  });

 }