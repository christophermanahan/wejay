const firebase = require('./firebaseTestIndex.spec');
const Firechief = require('../../server/firechief');

import { expect } from 'chai';

import { config } from '../utils/firebossTest';

import {

	sampleParty,
	sampleDjHostId,
	sampleDj,
	sampleSong,
	sampleTopTenFull,
	sampleSongHighestPri

} from '../utils';


const db = firebase.database();
const firechief = new Firechief(db);

describe('---------- FIRECHIEF TESTS ----------', () => {

	// setCurrentSong
	// pullFromShadowQueue
	// pullFromPersonalQueue


  describe('setCurrentSong function', () => {
    let partiesRef = db.ref('parties');
    let partyDjsRef = db.ref('party_djs');
    let topTenRef = db.ref('top_ten');
    let currentSongRef = db.ref('current_song');

    let hostId = sampleDjHostId;
    let partyId = hostId;

    let currentSong = sampleSong;

    before('Set up a party with some DJs, a current Song, and a Top Ten', done => {
      let samplePartyWithNeedSong = Object.assign(sampleParty, { needSong: true })
      const settingUpParty = [
      	partiesRef.set({[hostId]: samplePartyWithNeedSong}),
        partyDjsRef.set({[hostId]: {[hostId]: sampleDj}}),
        topTenRef.set({[hostId]: sampleTopTenFull}),
        currentSongRef.set({[hostId]: currentSong})
      ]

      let currentSongResult, needSongResult, topTenResult;

      Promise.all(settingUpParty)
        .then(() => {
          return firechief.setCurrentSong(partyId)
        })
        .then(() => {
          return Promise.all([
          	currentSongRef.child(hostId).once('value'),
          	partiesRef.child(hostId).once('value'),
          	topTenRef.child(hostId).once('value')
          ])
        })
        .then(resultsArr => {
          currentSongResult = resultsArr[0].val();
          needSongResult = resultsArr[1].val();
          topTenResult = resultsArr[2].val();
          done();
        })
        .catch(done)
    });

    after('destroy everything', done => {
    	const clearingParty = [
    		partiesRef.set({}),
    		partyDjsRef.set({}),
    		topTenRef.set({}),
    		currentSongRef.set({})
    	];
    	Promise.all(clearingParty)
    		.then(() => {
    			done();
    		})
    		.catch(done)
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
  })
})
