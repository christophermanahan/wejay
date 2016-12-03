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

    let spyCreateNewPartyListener;

    before('Create spy that wraps createNewPartyListener', done => {
      spyCreateNewPartyListener = spy(firechief, "createNewPartyListener");
      firechief.createPartyAddedListener()
      return partiesRef.child(idForNewSampleParty).set(sampleNewParty)
      // partiesRef.push(sampleNewParty)
      // partiesRef.set({[idForNewSampleParty]: sampleNewParty})
      .then(() => {
        return new Promise((res, rej) => {
          res(setTimeout(() => {}, 500))
        })
      })
    .then(() => {
      done();
    })
    .catch(done);

    // after('clear spy', () => {
    //   spyCreateNewPartyListener.restore();
    //   firechief.removePartyListener(idForNewSampleParty);
    // })


  })

  it('should call createNewPartyListener when party is added', () => {
    console.log("CALL COUNT HEREHEHREHREHREHHRE", spyCreateNewPartyListener.callCount);
    // expect(spyCreateNewPartyListener.called).to.be.true;
    console.log("ASD");
  })

  // it('should call createNewPartyListener when party is added', () => {
  //   expect(spyCreateNewPartyListener.calledOnce).to.equal(true);
  // })

  });

});
