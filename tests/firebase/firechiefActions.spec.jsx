const firebase = require('./firebaseTestIndex.spec');
const Firechief = require('../../server/firechief');

import { expect } from 'chai';

import {

	sampleParty,
	sampleDjHostId,
	sampleSong,
	sampleSong2,
	sampleSong5,
	sampleTopNine,
	sampleTopTenFull,
	sampleSongHighestPri,
	sampleShadowQueue,
	samplePersonalQueue,
  samplePartyDjs,
  sampleSQBefore,
  sampleSQAfter,
  sampleTTBefore,
  sampleTTAfter,
  sampleTopTenBeforeWorst,
  sampleTopTenAfterWorst,
  sampleShadowQueueBeforeWorst,
  sampleShadowQueueAfterWorst,
  samplePersonalQueueBeforeWorst,
  samplePersonalQueueAfterWorst


} from '../utils';


const db = firebase.database();
const firechief = new Firechief(db);

describe('---------- FIRECHIEF ACTION TESTS ----------', () => {

	let partyId = sampleDjHostId;
  let tomsUserId = 'tomsUserId';

	let partiesRef = db.ref('parties');
	let partyDjsRef = db.ref('party_djs');
	let topTenRef = db.ref('top_ten');
	let currentSongRef = db.ref('current_song');
	let shadowQueueRef = db.ref('shadow_queue');
	let personalQueueRef = db.ref('party_djs').child(partyId).child(tomsUserId).child('personal_queue');

  let sampleCurrentSong = sampleSong;
  let samplePartyWithNeedSong = Object.assign(sampleParty, { needSong: true });

  describe('setCurrentSong function', () => {


		let currentSongResult, needSongResult, topTenResult;


    before('Set up a party with some DJs, a current Song, and a Top Ten', done => {

      const settingUpParty = [
        partiesRef.set({[partyId]: samplePartyWithNeedSong}),
        topTenRef.set({[partyId]: sampleTopTenFull}),
        currentSongRef.set({[partyId]: sampleCurrentSong})
      ];


      Promise.all(settingUpParty)
        .then(() => {
          return firechief.setCurrentSong(partyId)
        })
        .then(() => {
          return Promise.all([
            currentSongRef.child(partyId).once('value'),
            partiesRef.child(partyId).once('value'),
            topTenRef.child(partyId).once('value')
          ]);
        })
        .then(resultsArr => {
          currentSongResult = resultsArr[0].val();
          needSongResult = resultsArr[1].val();
          topTenResult = resultsArr[2].val();
          done();
        })
        .catch(done);
    });

    after('destroy everything', done => {
      const clearingParty = [
        partiesRef.set({}),
        partyDjsRef.set({}),
        topTenRef.set({}),
        currentSongRef.set({})
      ];
      Promise.all(clearingParty)
        .then(() => done())
        .catch(done);
    });

    it('gets highest priority song from Top Ten and sets it to Current Song', () => {
			expect(currentSongResult).to.deep.equal(sampleSongHighestPri);
    });

    it('updates need song to false', () => {
			expect(needSongResult.needSong).to.equal(false);
    });

    it('removes song from Top Ten', () => {
      const topTenLen = Object.keys(topTenResult).length;
			expect(topTenResult.song1).to.be.undefined;
      expect(topTenLen).to.equal(9);
    });
  });


	describe('pullFromShadowQueue function', () => {

		let topTenResult, sqResult, uidResult;

		before('Set up party with a Top Ten and a Shadow Queue', done => {
			const settingUpParty = [
				partiesRef.set({[partyId]: sampleParty}),
				topTenRef.set({[partyId]: sampleTopNine}),
				shadowQueueRef.set({[partyId]: sampleShadowQueue})
			];


			Promise.all(settingUpParty)
				.then(() => {
					return firechief.pullFromShadowQueue(partyId);
				})
				.then((valsArr) => {
					uidResult = valsArr[0];
					return Promise.all([
						topTenRef.child(partyId).once('value'),
						shadowQueueRef.child(partyId).once('value')
					]);
				})
				.then(resultsArr => {
					topTenResult = resultsArr[0].val();
					sqResult = resultsArr[1].val();
					done();
				})
				.catch(done);
		});

		after('destroy everything', done => {
			const clearingParty = [
				partiesRef.set({}),
				partyDjsRef.set({}),
				topTenRef.set({}),
				shadowQueueRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => done())
				.catch(done);
		});

		it('captures the correct user ID', () => {
			expect(uidResult).to.deep.equal(tomsUserId);
		});

		it('Put highest priority song onto Top Ten', () => {
      const topTenLen = Object.keys(topTenResult).length;
			expect(topTenResult.song12).to.deep.equal(sampleSongHighestPri);
      expect(topTenLen).to.equal(10);
		});

		it('Deleted song from Shadow Queue', () => {
			const sqLen = Object.keys(sqResult).length;
      expect(sqResult.song12).to.be.undefined;
      expect(sqLen).to.equal(2);
		});
	});

	describe('pullFromPersonalQueue', () => {

		let sqResult, pqResult;

		before('Set up party with a Shadow Queue and Personal Queue', done => {
			const settingUpParty = [
				partiesRef.set({[partyId]: sampleParty}),
				partyDjsRef.set({[partyId]: samplePartyDjs}),
				shadowQueueRef.set({[partyId]: sampleShadowQueue}),
				personalQueueRef.set(samplePersonalQueue)
			];


			Promise.all(settingUpParty)
				.then(() => {
					return firechief.pullFromPersonalQueue(partyId, tomsUserId);
				})
				.then(() => {
					return Promise.all([
						shadowQueueRef.child(partyId).once('value'),
						personalQueueRef.once('value')
					]);
				})
				.then(resultsArr => {
					sqResult = resultsArr[0].val();
					pqResult = resultsArr[1].val();
					done();
				})
				.catch(done);
		});

		after('destroy everything', done => {
			const clearingParty = [
				partiesRef.set({}),
				partyDjsRef.set({}),
				personalQueueRef.set({}),
				shadowQueueRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => done())
				.catch(done);
		});

		it('Put song onto Shadow Queue', () => {
      const sqLen = Object.keys(sqResult).length;
			expect(sqResult.hashValInPQ1).to.deep.equal(sampleSong2);
      expect(sqLen).to.equal(4);
		});

		it('Remove song from Personal Queue', () => {
			expect(pqResult.hashValInPQ1).to.be.undefined;
		});

		it('Leaves remainder of Personal Queue intact', () => {
			expect(pqResult.hashValInPQ2).to.deep.equal(sampleSong5);
			const lengthPQ = Object.keys(pqResult).length;
			expect(lengthPQ).to.equal(1);
		});

	});

  describe('master reorder function', () => {

    let partiesResult, currentSongResult, topTenResult, sqResult, pqResult;

    before('Set up a fully-fledged party', done => {

      const settingUpFullParty = [
        partiesRef.set({[partyId]: samplePartyWithNeedSong}),
        partyDjsRef.set({[partyId]: samplePartyDjs}),
        currentSongRef.set({[partyId]: sampleCurrentSong}),
        topTenRef.set({[partyId]: sampleTopTenFull}),
        shadowQueueRef.set({[partyId]: sampleShadowQueue}),
        personalQueueRef.set(samplePersonalQueue)
      ];

      Promise.all(settingUpFullParty)
        .then(() => {
          return firechief.masterReorder(partyId);
        })
        .then(() => {
          return Promise.all([
            partiesRef.child(partyId).once('value'),
            currentSongRef.child(partyId).once('value'),
            topTenRef.child(partyId).once('value'),
            shadowQueueRef.child(partyId).once('value'),
            personalQueueRef.once('value')
          ]);
        })
        .then(resultsArr => {
          partiesResult = resultsArr[0].val();
          currentSongResult = resultsArr[1].val();
          topTenResult = resultsArr[2].val();
          sqResult = resultsArr[3].val();
          pqResult = resultsArr[4].val();
          done();
        })
        .catch(done);

    });

    after('destroy everything', done => {
      const clearingParty = [
      	partiesRef.set({}),
        partyDjsRef.set({}),
        currentSongRef.set({}),
        topTenRef.set({}),
        shadowQueueRef.set({}),
        personalQueueRef.set({})
      ];
      Promise.all(clearingParty)
        .then(() => done())
        .catch(done);
    });

		it('updates need song to false', () => {
			expect(partiesResult.needSong).to.equal(false);
		});

    it('gets highest priority song from Top Ten and sets it to Current Song', () => {
      expect(currentSongResult).to.deep.equal(sampleSongHighestPri);
			expect(topTenResult.song1).to.be.undefined;
			const topTenLen = Object.keys(topTenResult).length;
			expect(topTenLen).to.equal(10);
    });

    it('gets highest priority song from SQ and puts it on the Top Ten', () => {
      expect(topTenResult.song12).to.deep.equal(sampleSongHighestPri);
			const sqLen = Object.keys(sqResult).length;
			expect(sqLen).to.equal(3);
			expect(sqResult.song12).to.be.undefined;
			expect(sqResult.hashValInPQ1).to.deep.equal(sampleSong2);
    });

		it('pulls song from Personal Queue of user whose song was just pulled from the Shadow Queue', () => {
			const pqLen = Object.keys(pqResult).length;
			expect(pqLen).to.equal(1);
			expect(pqResult.hashValInPQ1).to.be.undefined;
			expect(pqResult.hashValInPQ2).to.deep.equal(sampleSong5)
    });

  });

  describe('createTimePriorityIncrementer function', () => {

		let topTenResult, sqResult, sqIncrementerState, ttIncrementerState;


		before('Set up party with a Top Ten and a Shadow Queue', done => {
			const settingUpParty = [
				partiesRef.set({[partyId]: sampleParty}),
				topTenRef.set({[partyId]: sampleTTBefore}),
				shadowQueueRef.set({[partyId]: sampleSQBefore})
			];

			const interval = 200;
			const num = 5;


			Promise.all(settingUpParty)
				.then(() => {
					firechief.createTimePriorityIncrementer(partyId, interval, 'top_ten');
					firechief.createTimePriorityIncrementer(partyId, interval, 'shadow_queue');
				})
				.then(() => {
					return new Promise((res, rej) => {
						setTimeout(res, 1100);	// leave extra 100ms for wiggle room
					});
				})
				.then(() => {
					return Promise.all([
						topTenRef.child(partyId).once('value'),
						shadowQueueRef.child(partyId).once('value')
					]);
				})
				.then(resultsArr => {
					topTenResult = resultsArr[0].val();
					sqResult = resultsArr[1].val();

					firechief.removeTimePriorityIncrementer(partyId, 'top_ten');
					firechief.removeTimePriorityIncrementer(partyId, 'shadow_queue');

					ttIncrementerState = firechief.incrementers[partyId].top_ten;
					sqIncrementerState = firechief.incrementers[partyId].shadow_queue;

					done();
				})
				.catch(done);
		});

		after('destroy everything', done => {

			const clearingParty = [
				partiesRef.set({}),
				topTenRef.set({}),
				shadowQueueRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => done())
				.catch(done);
		});


		it('adds only two incrementers', () => {
			const numIncrementers = Object.keys(firechief.incrementers[partyId]).length;
			expect(numIncrementers).to.equal(2);
		});

		it('increments the time_priority of each song in the top_ten once per specified interval', () => {
			expect(topTenResult).to.deep.equal(sampleTTAfter);
		});

		it('increments the time_priority of each song in the shadow_queue once per specified interval', () => {
			expect(sqResult).to.deep.equal(sampleSQAfter);
		});

		describe('removeTimePriorityIncrementer function', () => {

			it('removes the specified incrementer', () => {
				expect(ttIncrementerState).to.be.a('null');
				expect(sqIncrementerState).to.be.a('null');
			});

		});

	});

	describe('onRemoveWorstSong function', () => {

		let topTenResult;

		before('Set up party with Top Ten and SQ', done => {

			const setUpParty = [
				partiesRef.set({[partyId]: sampleParty}),
				topTenRef.set({[partyId]: topTenWithWorst}),
				shadowQueueRef.set({[partyId]: sampleShadowQueueBeforeWorst}),
				partyDjsRef.set({[partyId]: samplePartyDjs})
			];

			Promise.all(setUpParty)
				.then(() => {
					topTenRef.child('SOMETHING').update({vote_priority: })
				})



		});

		after('destroy everything', done => {

			const clearingParty = [
				partiesRef.set({}),
				topTenRef.set({}),
				shadowQueueRef.set({}),
				partyDjsRef.set({})
			];
			Promise.all(clearingParty)
				.then(() => done())
				.catch(done);
		});



	});

});
