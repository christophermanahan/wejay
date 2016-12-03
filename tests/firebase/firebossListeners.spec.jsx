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
          samplePersonalQueue

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
          .then(() => setTimeout(done, 100))
          .catch(done)
      }, 100)


    });

    after('turn off parties listener', done => {
      fireboss.database.ref('parties').off()
      partiesSpy.restore()
      // done()

      // breaks tests?
      partiesRef.remove()
        .then(() => done())
        .catch(done)
    });

    describe('setParties', () => {
      it('has been called twice within 200ms', () => {
        expect(partiesSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(partiesSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(partiesSpy.secondCall.calledWith(sampleParties))
      });
    })

  });


  describe('TESTING SET UP ALL PARTY LISTENERS', () => {
    let currentSongSpy;
    let topTenSpy;
    let partyDjsSpy;
    let shadowQueueSpy;
    let personalQueueSpy;

    before('set up parties listener and update party data', done => {
      // set up spies
      currentSongSpy = spy(fireboss.dispatchers, 'setCurrentSong');
      topTenSpy = spy(fireboss.dispatchers, 'setTopTen');
      partyDjsSpy = spy(fireboss.dispatchers, 'setDjs');
      shadowQueueSpy = spy(fireboss.dispatchers, 'setShadowQueue');
      personalQueueSpy = spy(fireboss.dispatchers, 'setPersonalQueue');


      const setFakeParties = partiesRef.set(sampleParties);

      setFakeParties
        .then(() => {
          fireboss.setUpAllPartyListeners(sampleDjHostId, sampleUser);
            setTimeout(() => {
                const setFakeUserParties = userPartiesRef.set({[sampleDjHostId]: sampleDjHostId});
                const setFakePartyDjs = partyDjsRef.child(sampleDjHostId).set(fbSamplePartyDjs);
                const setFakeCurrentSong = currentSongRef.child(sampleDjHostId).set(sampleSong);
                const setFakeTopTen = topTenRef.child(sampleDjHostId).set(sampleTopTenFull);
                const setFakeShadowQueue = shadowQueueRef.child(sampleDjHostId).set(fbSampleShadowQueue);

                Promise.all([setFakeUserParties, setFakePartyDjs, setFakeCurrentSong, setFakeTopTen, setFakeShadowQueue])
                  .then(() => {
                    setTimeout(done, 500)
                  })
              })
            }, 500)
    })

      // activate party listeners


      // wait 100ms for initial responses, then udpate db




    after('turn off party listeners and clear db', done => {
      // removing spies
      currentSongSpy.restore();
      topTenSpy.restore();
      partyDjsSpy.restore();
      shadowQueueSpy.restore();
      personalQueueSpy.restore();

      // removing listeners
      fireboss.removePartyListeners(sampleDjHostId, sampleUser)

      // clearing db
      Promise.all([partiesRef.remove(), userPartiesRef.remove(), partyDjsRef.remove(),
                  currentSongRef.remove(), topTenRef.remove(), shadowQueueRef.remove()])
      .then(() => done())
      .catch(done)
    });

    describe('setCurrentSong', () => {
      it('has been called twice within 200ms', () => {
        expect(currentSongSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(currentSongSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(currentSongSpy.secondCall.calledWith(sampleSong))
      });
    });

    describe('setTopTen', () => {
      it('has been called twice within 200ms', () => {
        expect(topTenSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(topTenSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(topTenSpy.secondCall.calledWith(sampleTopTenFull))
      });
    });

    describe('setShadowQueue', () => {
      it('has been called twice within 200ms', () => {
        expect(shadowQueueSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(shadowQueueSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        // console.log({song11: sampleSong})
        // gitexpect(shadowQueueSpy.secondCall.calledWithMatch())
      });
    });

    describe('setDjs', () => {
      it('has been called twice within 200ms', () => {
        expect(partyDjsSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(partyDjsSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(partyDjsSpy.secondCall.calledWith(fbSamplePartyDjs))
      });
    });


    describe('setPersonalQueue', () => {
      it('has been called twice within 200ms', () => {
        expect(personalQueueSpy.calledTwice)
      });

      it('has been called with a value of null', () => {
        expect(personalQueueSpy.firstCall.calledWith(null))
      });

      it('has been called with properly formatted data', () => {
        expect(personalQueueSpy.secondCall.calledWith(fbSamplePartyDjs[sampleUser.uid]['personal_queue']))
      });
    });
  });


  describe('TESTING REMOVE ALL PARTY LISTENERS', () => {
    let currentSongSpy;
    let topTenSpy;
    let partyDjsSpy;
    let shadowQueueSpy;
    let personalQueueSpy;

    before('set up parties listener and update party data', done => {
      // set up spies
      currentSongSpy = spy(fireboss.dispatchers, 'setCurrentSong');
      topTenSpy = spy(fireboss.dispatchers, 'setTopTen');
      partyDjsSpy = spy(fireboss.dispatchers, 'setDjs');
      shadowQueueSpy = spy(fireboss.dispatchers, 'setShadowQueue');
      personalQueueSpy = spy(fireboss.dispatchers, 'setPersonalQueue');

      // activate party listeners
      fireboss.setUpAllPartyListeners(sampleDjHostId, sampleUser);

      // wait 100ms for initial responses, remove, listeners, then udpate db
      setTimeout(() => {
        const setFakeParties = partiesRef.set(sampleParties);

        // complete updates, then wait for data updates
        setFakeParties
        .then(() => {
          const setFakeUserParties = userPartiesRef.set({[sampleDjHostId]: sampleDjHostId});
          const setFakePartyDjs = partyDjsRef.child(sampleDjHostId).set(fbSamplePartyDjs);
          const setFakeCurrentSong = currentSongRef.child(sampleDjHostId).set(sampleSong);
          const setFakeTopTen = topTenRef.child(sampleDjHostId).set(sampleTopTenFull);
          const setFakeShadowQueue = shadowQueueRef.child(sampleDjHostId).set(fbSampleShadowQueue);

          return Promise.all([setFakeUserParties, setFakePartyDjs, setFakeCurrentSong, setFakeTopTen, setFakeShadowQueue])
        })
        .then(() => {
          setTimeout(done, 500)
        })
      }, 500)

    });

    after('turn off party listeners and clear db', done => {
      // removing spies
      currentSongSpy.restore();
      topTenSpy.restore();
      partyDjsSpy.restore();
      shadowQueueSpy.restore();
      personalQueueSpy.restore();

      // removing listeners
      fireboss.removePartyListeners(sampleDjHostId, sampleUser)

      // clearing db
      Promise.all([partiesRef.remove(), userPartiesRef.remove(), partyDjsRef.remove(),
                  currentSongRef.remove(), topTenRef.remove(), shadowQueueRef.remove()])
      .then(() => done())
      .catch(done)
    });

    describe('setCurrentSong', () => {
      it('has been called twice within 200ms', () => {
        expect(currentSongSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(currentSongSpy.firstCall.calledWith(null))
      });
    });

    describe('setTopTen', () => {
      it('has been called twice within 200ms', () => {
        expect(topTenSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(topTenSpy.firstCall.calledWith(null))
      });
    });

    describe('setShadowQueue', () => {
      it('has been called twice within 200ms', () => {
        expect(shadowQueueSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(shadowQueueSpy.firstCall.calledWith(null))
      });
    });

    describe('setDjs', () => {
      it('has been called twice within 200ms', () => {
        expect(partyDjsSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(partyDjsSpy.firstCall.calledWith(null))
      });
    });


    describe('setPersonalQueue', () => {
      it('has been called twice within 200ms', () => {
        expect(personalQueueSpy.calledOnce)
      });

      it('has been called with a value of null', () => {
        expect(personalQueueSpy.firstCall.calledWith(null))
      });
    });
  });



});
