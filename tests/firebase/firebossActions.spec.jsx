// start firebase test server
import firebase from 'firebase'
import Fireboss from '../../app/utils/fireboss'
import { expect } from 'chai';

import { dispatchers, config } from '../utils/firebossTest'
import { sampleParty, sampleDj, sampleUser,  } from '../utils/index'

const browserHistory = []

firebase.initializeApp(config);

const fireboss = new Fireboss(firebase, dispatchers, browserHistory)

describe('---------- FIREBOSS TESTS ----------', () => {

  describe('TESTING JOIN PARTY ACTIONS', () => {
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
          Promise.all([partiesRef.once('value'), userPartiesRef.once('value'), partyDjsRef.once('value')])
            .then(resultsArr => {
              partiesResult = resultsArr[0].val();
              userPartiesResult = resultsArr[1].val();
              partyDjsResult = resultsArr[2].val();
              done()
            })
        })
        .catch(done)
    });

    after('destory everything', done => {
      Promise.all([partiesRef.set({}), userPartiesRef.set({}), partyDjsRef.set({})])
        .then(() => {
          done()
        })
        .catch(done)
    });

    it('pushes the user to /app', () => {
      expect(browserHistory[0]).to.equal('/app')
    });

    it('adds the user to user_parties', () => {
      expect(userPartiesResult[sampleUser.uid]).to.equal(hostId)
      expect(Object.keys(userPartiesResult)).to.have.length.of(2)
    });

    it('adds the user to party_djs', () => {
      expect(Object.keys(partyDjsResult)).to.have.length.of(1)
      expect(Object.keys(partyDjsResult[hostId])).to.have.length.of(2)
      expect(partyDjsResult[hostId][sampleUser.uid].dj_points).to.equal(0)
      expect(partyDjsResult[hostId][sampleUser.uid].dj_name).to.equal(`DJ ${sampleUser.displayName}`)
      expect(partyDjsResult[hostId][sampleUser.uid].uid).to.equal(sampleUser.uid)
    });

    it('does not create a new party', () => {
      expect(Object.keys(partiesResult)).to.have.length.of(1)
    });

  });

  describe('TESTING CREATE PARTY ACTIONS', () => {
    let hostId = "abc123";
    let partyId = hostId;
    let partiesResult, userPartiesResult, partyDjsResult;

    before('create a new party', done => {
      let partiesRef = firebase.database().ref('parties')
      let userPartiesRef = firebase.database().ref('user_parties')
      let partyDjsRef = firebase.database().ref('party_djs')

      const setUpParty = [partiesRef.set({[hostId]: sampleParty}),
                          userPartiesRef.set({[hostId]: hostId}),
                          partyDjsRef.set({[hostId]: {[hostId]: sampleDj}})]

      Promise.all(setUpParty)
        .then(() => {
          return fireboss.joinParty(partyId, sampleUser)
        })
        .then(() => {
          Promise.all([partiesRef.once('value'), userPartiesRef.once('value'), partyDjsRef.once('value')])
            .then(resultsArr => {
              partiesResult = resultsArr[0].val();
              userPartiesResult = resultsArr[1].val();
              partyDjsResult = resultsArr[2].val();
              done()
            })
        })
        .catch(done)
    });

    it('pushes the user to /app', () => {
      expect(browserHistory[0]).to.equal('/app')
    });

    it('adds the user to user_parties', () => {
      expect(userPartiesResult[sampleUser.uid]).to.equal(hostId)
      expect(Object.keys(userPartiesResult)).to.have.length.of(2)
    });

    it('adds the user to party_djs', () => {
      expect(Object.keys(partyDjsResult)).to.have.length.of(1)
      expect(Object.keys(partyDjsResult[hostId])).to.have.length.of(2)
      expect(partyDjsResult[hostId][sampleUser.uid].dj_points).to.equal(0)
      expect(partyDjsResult[hostId][sampleUser.uid].dj_name).to.equal(`DJ ${sampleUser.displayName}`)
      expect(partyDjsResult[hostId][sampleUser.uid].uid).to.equal(sampleUser.uid)
    });

    it('does not create a new party', () => {
      expect(Object.keys(partiesResult)).to.have.length.of(1)
    });

  });


  // a user can create a party
  // a user can submit a song and it goes to the right spot
  // a guest can log out
  // a host can log out
  // a guest can leave the party
  // a host can leave the party

});

