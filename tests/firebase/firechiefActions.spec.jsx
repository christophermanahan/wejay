const firebase = require('./firebaseTestIndex.spec');
const Firechief = require('../../server/firechief');

import { expect } from 'chai';

import { config } from '../utils/firebossTest';

import {

	sampleParty,
	sampleDjHostId,
	sampleDj,
	sampleSong,
	sampleSong2,
	sampleSong5,
	sampleTopNine,
	sampleTopTenFull,
	sampleSongHighestPri,
	sampleShadowQueue,
	samplePersonalQueue

} from '../utils';


const db = firebase.database();
const firechief = new Firechief(db);

describe('---------- FIRECHIEF TESTS ----------', () => {

	let hostId = sampleDjHostId;
	let partyId = hostId;

	let partiesRef = db.ref('parties');
	let partyDjsRef = db.ref('party_djs');
	let topTenRef = db.ref('top_ten');
	let currentSongRef = db.ref('current_song');
	let shadowQueueRef = db.ref('shadow_queue');
	let personalQueueRef = db.ref('party_djs').child(partyId).child('tomsUserId').child('personal_queue');



  describe('setCurrentSong function', () => {

    let currentSong = sampleSong;

		let currentSongResult, needSongResult, topTenResult;


    before('Set up a party with some DJs, a current Song, and a Top Ten', done => {
      let samplePartyWithNeedSong = Object.assign(sampleParty, { needSong: true })
      const settingUpParty = [
      	partiesRef.set({[hostId]: samplePartyWithNeedSong}),
        partyDjsRef.set({[hostId]: {[hostId]: sampleDj}}),
        topTenRef.set({[hostId]: sampleTopTenFull}),
        currentSongRef.set({[hostId]: currentSong})
      ]


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
			expect(currentSongResult).to.deep.equal(sampleSongHighestPri)
    });

    it('updates need song to false', () => {
			expect(needSongResult.needSong).to.equal(false)
    });

    it('removes song from Top Ten', () => {
			expect(topTenResult.song1).to.be.undefined;
    });
  })


	describe('pullFromShadowQueue function', () => {

		let topTenResult, sqResult, uidResult

		before('Set up party with a Top Ten and a Shadow Queue', done => {
			const settingUpParty = [
				partiesRef.set({[hostId]: sampleParty}),
				partyDjsRef.set({[hostId]: {[hostId]: sampleDj}}),
				topTenRef.set({[hostId]: sampleTopNine}),
				shadowQueueRef.set({[hostId]: sampleShadowQueue})
			];


			Promise.all(settingUpParty)
				.then(() => {
					return firechief.pullFromShadowQueue(partyId)
				})
				.then((valsArr) => {
					uidResult = valsArr[0]
					return Promise.all([
						topTenRef.child(hostId).once('value'),
						shadowQueueRef.child(hostId).once('value')
					]);
				})
				.then(resultsArr => {
					topTenResult = resultsArr[0].val();
					sqResult = resultsArr[1].val();
					done();
				})
				.catch(done)
		});

		after('destroy everything', done => {
			const clearingParty = [
				partiesRef.set({}),
				partyDjsRef.set({}),
				topTenRef.set({}),
				shadowQueueRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => {
					done();
				})
				.catch(done)
		});

		it('captures the correct user ID', () => {
			expect(uidResult).to.deep.equal("tomsUserId");
		})

		it('Put highest priority song onto Top Ten', () => {
			expect(topTenResult.song12).to.deep.equal(sampleSongHighestPri);
		})

		it('Deleted song from Shadow Queue', () => {
			expect(sqResult.song12).to.be.undefined;
		})

	})

	describe('pullFromPersonalQueue', () => {

		let sqResult, pqResult;

		before('Set up party with a Shadow Queue and Personal Queue', done => {
			const settingUpParty = [
				partiesRef.set({[hostId]: sampleParty}),
				partyDjsRef.set({[hostId]: {[hostId]: sampleDj}}),
				shadowQueueRef.set({[hostId]: sampleShadowQueue}),
				personalQueueRef.set({'tomsUserId': samplePersonalQueue})
			];


			Promise.all(settingUpParty)
				.then(() => {
					return firechief.pullFromPersonalQueue(partyId, 'tomsUserId')
				})
				.then(() => {
					return Promise.all([
						shadowQueueRef.child(hostId).once('value'),
						personalQueueRef.child('tomsUserId').once('value')
					]);
				})
				.then(resultsArr => {
					sqResult = resultsArr[0].val();
					pqResult = resultsArr[1].val();
					done();
				})
				.catch(done)
		});

		after('destroy everything', done => {
			const clearingParty = [
				partiesRef.set({}),
				partyDjsRef.set({}),
				personalQueueRef.set({}),
				shadowQueueRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => {
					done();
				})
				.catch(done)
		});

		it('Put song onto Shadow Queue', () => {
			console.log("SQ RESULT", sqResult);
			expect(sqResult.hashValInPQ1).to.deep.equal(sampleSong2);
		})

		it('Remove song from Personal Queue', () => {
			console.log("PQ RESULT", pqResult);
			expect(pqResult.hashValInPQ1).to.be.undefined;
		})

		it('Leaves remainder of Personal Queue intact', () => {
			expect(pqResult.hashValInPQ2).to.deep.equal(sampleSong5)
			const lengthPQ = Object.keys(pqResult).length
			expect(lengthPQ).to.equal(1);
		})



	})








})
