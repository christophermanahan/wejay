const firebase = require('./firebaseTestIndex.spec');

import Fireboss from '../../app/utils/fireboss';
import { expect } from 'chai';

import { dispatchers } from '../utils/firebossTest';
import { sampleParty, sampleDj, sampleUser, sampleSong, sampleSong2 } from '../utils';

const browserHistory = [];

const fireboss = new Fireboss(firebase, dispatchers, browserHistory);

let fakeTopTen = {
  song1: sampleSong,
  song2: sampleSong,
  song3: sampleSong,
  song4: sampleSong,
  song5: sampleSong,
  song6: sampleSong,
  song7: sampleSong,
  song8: sampleSong,
  song9: sampleSong,
  song10: sampleSong
};


describe('---------- FIREBOSS TESTS ----------', () => {

  describe('TESTING JOIN PARTY METHOD', () => {
    let hostId = "abc123";
    let partyId = hostId;
    let partiesResult, userPartiesResult, partyDjsResult;
    let partiesRef = firebase.database().ref('parties')
    let userPartiesRef = firebase.database().ref('user_parties')
    let partyDjsRef = firebase.database().ref('party_djs')

    before('create the party with a host and add a guest user to it', done => {
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
      browserHistory.pop()
      fireboss.removePartyListeners(partyId, sampleUser)
        .then(() => {
          return Promise.all([partiesRef.set({}), userPartiesRef.set({}), partyDjsRef.set({})])
        })
        .then(() => {
          done();
        })
        .catch(done)
    });

    it('pushes the user to /app', () => {
      expect(browserHistory[0]).to.equal('/app')
      expect(browserHistory[1]).to.equal(undefined)
    });

    it('adds the user to user_parties', () => {
      expect(userPartiesResult[sampleUser.uid]).to.equal(partyId)
      expect(Object.keys(userPartiesResult)).to.have.length.of(2)
    });

    it('adds the user to party_djs', () => {
      expect(Object.keys(partyDjsResult)).to.have.length.of(1)
      expect(Object.keys(partyDjsResult[partyId])).to.have.length.of(2)
      expect(partyDjsResult[partyId][sampleUser.uid].dj_points).to.equal(0)
      expect(partyDjsResult[partyId][sampleUser.uid].dj_name).to.equal(`DJ ${sampleUser.displayName}`)
      expect(partyDjsResult[partyId][sampleUser.uid].uid).to.equal(sampleUser.uid)
    });

    it('does not create a new party', () => {
      expect(Object.keys(partiesResult)).to.have.length.of(1)
    });

  });



  describe('TESTING CREATE PARTY METHOD', () => {
    let partiesResult, userPartiesResult, partyDjsResult;
    let partiesRef = firebase.database().ref('parties')
    let userPartiesRef = firebase.database().ref('user_parties')
    let partyDjsRef = firebase.database().ref('party_djs')
    let partyId = sampleUser.uid


    before('create a new party', done => {
      fireboss.createPartyWithListeners(partyId, sampleUser, sampleParty)
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
      browserHistory.pop()
      fireboss.removePartyListeners(partyId, sampleUser)
        .then(() => {
          return Promise.all([partiesRef.set({}), userPartiesRef.set({}), partyDjsRef.set({})])
        })
        .then(() => {
          done()
        })
        .catch(done)
    });

    it('pushes the user to /app', () => {
      expect(browserHistory[0]).to.equal('/app')
      expect(browserHistory[1]).to.equal(undefined)
    });

    it('adds the user to user_parties', () => {
      expect(userPartiesResult[partyId]).to.equal(sampleUser.uid)
      expect(Object.keys(userPartiesResult)).to.have.length.of(1)
    });

    it('adds the user to party_djs', () => {
      expect(Object.keys(partyDjsResult)).to.have.length.of(1)
      expect(Object.keys(partyDjsResult[partyId])).to.have.length.of(1)
      expect(partyDjsResult[partyId][sampleUser.uid].dj_points).to.equal(0)
      expect(partyDjsResult[partyId][sampleUser.uid].dj_name).to.equal(`DJ ${sampleUser.displayName}`)
      expect(partyDjsResult[partyId][sampleUser.uid].uid).to.equal(sampleUser.uid)
    });

    it('creates a new party', () => {
      expect(Object.keys(partiesResult)).to.have.length.of(1)
      expect(partiesResult[partyId].name).to.equal(sampleParty.name)
      expect(partiesResult[partyId].location).to.equal(sampleParty.location)
      expect(partiesResult[partyId].active).to.equal(true)
      expect(partiesResult[partyId].needSong).to.equal(false)
    });

  });

    describe('TESTING SUBMIT USER SONG METHOD', () => {
    let partiesResult, userPartiesResult, partyDjsResult;
    let hostId = "abc123";
    let partyId = hostId;

    let partiesRef = firebase.database().ref('parties')
    let userPartiesRef = firebase.database().ref('user_parties')
    let partyDjsRef = firebase.database().ref('party_djs')
    let currentSongRef = firebase.database().ref('current_song')
    let topTenRef = firebase.database().ref('top_ten')
    let shadowQueueRef = firebase.database().ref('shadow_queue')

    before('create a new party with only the host', done => {
      const setUpParty = [partiesRef.set({[hostId]: sampleParty}),
                          userPartiesRef.set({[hostId]: hostId}),
                          partyDjsRef.set({[hostId]: {[hostId]: sampleDj}})]

      Promise.all(setUpParty)
        .then(() => {
          done()
        })
    });

    after('destroy everything', done => {
      fireboss.removePartyListeners(partyId, sampleUser)
        .then(() => {
          const clear1 = partiesRef.set({})
          const clear2 = userPartiesRef.set({})
          const clear3 = partyDjsRef.set({})
          return Promise.all([clear1, clear2 , clear3])
        })
        .then(() => {
          done()
        })
        .catch(done)
    });

    afterEach('destroy party queues', done => {
      fireboss.removePartyListeners(partyId, sampleUser)
        .then(() => {
          const clear4 = currentSongRef.set({})
          const clear5 = topTenRef.set({})
          const clear6 = shadowQueueRef.set({})
          return Promise.all([clear4, clear5, clear6])
        })
        .then(() => {
          done()
        })
        .catch(done)
    });

    it('does not push the user anywhere', () => {
      expect(browserHistory[0]).to.equal(undefined)
    });

    it('if no current song, sets user suggestion to current song', done => {
      fireboss.submitUserSong(partyId, sampleUser, sampleSong, () => {})
        .then(() =>{
          return currentSongRef.child(partyId).once('value')
        })
        .then(snapshot => {
          expect(snapshot.val()).to.be.deep.equal(sampleSong)
          done()
        })
        .catch(done)
    });

    it('if current song, adds user suggestion to top ten', done => {
      currentSongRef.set({[partyId]: sampleSong})
        .then(() => {
          return fireboss.submitUserSong(partyId, sampleUser, sampleSong2, () => {})
        })
        .then(() => {
          return topTenRef.child(partyId).once('value')
        })
        .then(snapshot => {
          let topTenResults = snapshot.val()
          let topTenProps = Object.keys(topTenResults)
          expect(topTenProps).to.have.length.of(1)
          expect(topTenResults[topTenProps[0]]).to.be.deep.equal(sampleSong2)
          done()
        })
        .catch(done)

    });

    it('if current song & top ten full, adds user suggestion to shadow queue', done => {
      Promise.all([currentSongRef.set({[partyId]: sampleSong}), topTenRef.set({[partyId]: fakeTopTen})])
        .then(() =>{
          return fireboss.submitUserSong(partyId, sampleUser, sampleSong2, () => {})
        })
        .then(() => {
          return shadowQueueRef.once('value')
        })
        .then(snapshot => {
          let shadowQueueResults = snapshot.val()
          let songId = Object.keys(shadowQueueResults[partyId])[0]
          expect(Object.keys(shadowQueueResults)).to.have.length.of(1)
          expect(Object.keys(shadowQueueResults[partyId])).to.have.length.of(1)
          expect(shadowQueueResults[partyId][songId]).to.be.deep.equal(sampleSong2)
          expect(shadowQueueResults[partyId][songId].uid).to.equal(sampleUser.uid)
          done()
        })
        .catch(done)
    });

    it('if current song, top ten, and shadow queue full, adds user suggestion to shadow queue', done => {
      let sqSong = Object.assign({}, sampleSong, {uid: sampleUser.uid})

      Promise.all([currentSongRef.set({[partyId]: sampleSong}),
                  topTenRef.set({[partyId]: fakeTopTen}),
                  shadowQueueRef.set({[partyId]: {song1: sqSong}}),
                  partyDjsRef.set({[partyId]: {[sampleUser.uid]: {}}})])
        .then(() =>{
          return fireboss.submitUserSong(partyId, sampleUser, sampleSong2, () => {})
        })
        .then(() => {
          return partyDjsRef.child(partyId).child(sampleUser.uid).child('personal_queue').once('value')
        })
        .then(snapshot => {
          let personalQueueResult = snapshot.val()
          let songId = Object.keys(personalQueueResult)[0]
          expect(Object.keys(personalQueueResult)).to.have.length.of(1)
          expect(personalQueueResult[songId]).to.be.deep.equal(sampleSong2)
          expect(personalQueueResult[songId].uid).to.equal(sampleUser.uid)
          done()
        })
        .catch(done)
    });
  });


  // LOG OUT
  // -- removes user from user_parties
  // -- removes user from party_djs
  // -- if host, destroys entire party and everything to do with it
  // -- pushes to '/signup'

  // LEAVE PARTY
  // -- removes user from user_parties
  // -- removes user from party_djs
  // -- if host, destroys entire party and everything to do with it
  // -- pushes to '/parties'

});

