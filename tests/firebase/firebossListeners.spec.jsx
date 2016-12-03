const firebase = require('./firebaseTestIndex.spec');

import Fireboss from '../../app/utils/fireboss';
import { expect } from 'chai';
import { spy } from 'sinon';

import { dispatchers } from '../utils/firebossTest';
import {
          sampleParty,
          sampleParties,
          sampleDj,
          sampleUser,
          sampleDjHostId,
          sampleDjHost,
          fbSamplePartyDjs,
          sampleSong,
          sampleSong2,
          sampleTopTenFull,
          fbSampleShadowQueue,
          sampleDJsInSingleParty,
          samplePersonalQueue,
          sqSong2

} from '../utils';

const browserHistory = [];

const fireboss = new Fireboss(firebase, dispatchers, browserHistory);


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
      partiesSpy = spy(fireboss.dispatchers, 'setParties')
      fireboss.createPartiesListener()

      setTimeout(() => {
        partiesRef.set(sampleParties)
          .then(() => setTimeout(done, 500))
          .catch(done)
      }, 500)


    });

    after('turn off parties listener', done => {
      fireboss.database.ref('parties').off()
      partiesSpy.restore()

      // breaks tests?
      partiesRef.remove()
        .then(() => done())
        .catch(done)
    });

    describe('setParties', () => {
      it('has been called once within 500ms', () => {
        expect(partiesSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(partiesSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(partiesSpy.secondCall.calledWith(sampleParties))
      });
    })

  });


  describe('TESTING PARTY LISTENERS', () => {
    let currentSongSpy;
    let topTenSpy;
    let partyDjsSpy;
    let shadowQueueSpy;
    let personalQueueSpy;

    describe('testing listener set up', () => {

      before('set up parties listener and update party data', done => {
        // set up spies
        currentSongSpy = spy(fireboss.dispatchers, 'setCurrentSong');
        topTenSpy = spy(fireboss.dispatchers, 'setTopTen');
        partyDjsSpy = spy(fireboss.dispatchers, 'setDjs');
        shadowQueueSpy = spy(fireboss.dispatchers, 'setShadowQueue');
        personalQueueSpy = spy(fireboss.dispatchers, 'setPersonalQueue');

        // create fake party
        const setFakeParty = Promise.all([partiesRef.set(sampleParties),
                                          userPartiesRef.set({[sampleDjHostId]: sampleDjHostId}),
                                          partyDjsRef.child(sampleDjHostId).set(fbSamplePartyDjs),
                                          currentSongRef.child(sampleDjHostId).set(sampleSong),
                                          topTenRef.child(sampleDjHostId).set(sampleTopTenFull),
                                          shadowQueueRef.child(sampleDjHostId).set(fbSampleShadowQueue)]);

        // then listen to data from fake party
        setFakeParty
          .then(() => {
            fireboss.setUpAllPartyListeners(sampleDjHostId, sampleUser)
            return new Promise((res, rej) => {
              setTimeout(res, 500);
            })
          })
          .then(() => { done() })
          .catch(done)
      })

      describe('setCurrentSong', () => {
        it('has been called once within 500ms', () => {
          expect(currentSongSpy.calledOnce).to.be.true
        });

        it('has been called with properly formatted data', () => {
          expect(currentSongSpy.calledWith(sampleSong)).to.be.true
        });
      });

      describe('setTopTen', () => {
        it('has been called once within 500ms', () => {
          expect(topTenSpy.calledOnce).to.be.true
        });

        it('has been called with properly formatted data', () => {
          expect(topTenSpy.calledWith(sampleTopTenFull)).to.be.true
        });
      });

      describe('setShadowQueue', () => {
        it('has been called once within 500ms', () => {
          expect(shadowQueueSpy.calledOnce).to.be.true
        });

        it('has been called with properly formatted data', () => {
          expect(shadowQueueSpy.calledWith({song12: sqSong2})).to.be.true
        });
      });

      describe('setDjs', () => {
        it('has been called once within 500ms', () => {
          expect(partyDjsSpy.calledOnce).to.be.true
        });

        it('has been called with properly formatted data', () => {
          expect(partyDjsSpy.calledWith(fbSamplePartyDjs)).to.be.true
        });
      });


      describe('setPersonalQueue', () => {
        it('has been called once within 500ms', () => {
          expect(personalQueueSpy.calledOnce).to.be.true
        });

        it('has been called with properly formatted data', () => {
          expect(personalQueueSpy.calledWith(fbSamplePartyDjs[sampleUser.uid]['personal_queue'])).to.be.true
        });
      });


      after('turn off party listeners and clear db', done => {
        // removing listeners
        fireboss.removePartyListeners(sampleDjHostId, sampleUser)

        // clearing db
        const clearingDB = Promise.all([partiesRef.remove(),
                                    userPartiesRef.remove(),
                                    partyDjsRef.remove(),
                                    currentSongRef.remove(),
                                    topTenRef.remove(),
                                    shadowQueueRef.remove()])
        clearingDB
          .then(() => {
            // wait for listeners to hear the clearing of the db
            return new Promise((res, rej) => {
              setTimeout(res, 500);
            })
          })
          .then(() => { done() })
          .catch(done)
      });
    });

    describe('testing listener tear down', () => {

      describe('setCurrentSong', () => {
        it('did not dispatch after the listeners were removed', () => {
          expect(currentSongSpy.calledOnce).to.be.true
        });
      });

      describe('setTopTen', () => {
        it('did not dispatch after the listeners were removed', () => {
          expect(topTenSpy.calledOnce).to.be.true
        });
      });

      describe('setShadowQueue', () => {
        it('did not dispatch after the listeners were removed', () => {
          expect(shadowQueueSpy.calledOnce).to.be.true
        });
      });

      describe('setDjs', () => {
        it('did not dispatch after the listeners were removed', () => {
          expect(partyDjsSpy.calledOnce).to.be.true
        });
      });

      describe('setPersonalQueue', () => {
        it('did not dispatch after the listeners were removed', () => {
          expect(personalQueueSpy.calledOnce).to.be.true
        });
      });

      after('turn off spies ', () => {
        // removing spies
        currentSongSpy.restore();
        topTenSpy.restore();
        partyDjsSpy.restore();
        shadowQueueSpy.restore();
        personalQueueSpy.restore();
      });
    });
  });
})
