const firebase = require('./firebaseTestIndex.spec');
const Firechief = require('../../server/firechief');

import { expect } from 'chai';

import { spy } from 'sinon';

import {

	sampleParties,
  sampleNewParty,
  idForNewSampleParty

} from '../utils';

const db = firebase.database();
const firechief = new Firechief(db);

describe('---------- FIRECHIEF LISTENER TESTS ----------', () => {

  describe('createPartyAddedListener function', () => {

    let partiesRef = db.ref('parties');

    let spyCreatePartyAddedListener;

    before('Create spy that wraps createPartyAddedListener', done => {
      spyCreatePartyAddedListener = spy(firechief, "createPartyAddedListener");
      spyCreatePartyAddedListener()
      partiesRef.set({[idForNewSampleParty]: sampleNewParty})
      .then(() => {
        done()
      })
      .catch(done);

    })

    after('clear spy', () => {
      spyCreatePartyAddedListener.restore();
    })

    // it('should have been called with createNewPartyListener')

  })









});
