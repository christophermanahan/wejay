const firebase = require('./firebaseTestIndex.spec');
const Firechief = require('../../server/firechief');

import { expect } from 'chai';

import { spy } from 'sinon';

import {

	sampleParties,
  sampleNewParty,
  idForNewSampleParty,
  dillonsUserIdwhichisalsothepartyid

} from '../utils';

const db = firebase.database();
const firechief = new Firechief(db);

describe('---------- FIRECHIEF LISTENER TESTS ----------', () => {

  let partiesRef = db.ref('parties');


  describe('createPartyAddedListener function', () => {

    let spyCreateNewPartyListener;

    beforeEach('Create spy that wraps createNewPartyListener', done => {
      spyCreateNewPartyListener = spy(firechief, "createNewPartyListener");

      firechief.createPartyAddedListener();

      partiesRef.child(idForNewSampleParty).set(sampleNewParty)
      .then(() => setTimeout( () => done(), 500 ) )
      .catch(done);
    });

    afterEach('clear spy and reset firebase', done => {
      spyCreateNewPartyListener.restore();
      partiesRef.off();
      partiesRef.set({})
        .then(() => done())
        .catch(done);
    });

    it('should call createNewPartyListener when party is added', () => {
      expect(spyCreateNewPartyListener.called).to.be.true;
      expect(spyCreateNewPartyListener.callCount).to.equal(1);
    });

    it('should call createNewPartyListener with the ID of the added party', () => {
      expect(spyCreateNewPartyListener.calledWith(idForNewSampleParty)).to.equal(true);
    });

  });


  describe('createPartyRemovedListener function', () => {

    let spyRemovePartyListener;

    beforeEach('Create spy that wraps removePartyListener', done => {
      spyRemovePartyListener = spy(firechief, "removePartyListener");

      firechief.createPartyRemovedListener();

      partiesRef.set(sampleParties)
      .then(() => {
        return partiesRef.child(dillonsUserIdwhichisalsothepartyid).remove()
      })
      .then(() => setTimeout( () => done(), 500 ) )
      .catch(done);
    });

    afterEach('clear spy and reset firebase', done => {
      spyRemovePartyListener.restore();
      partiesRef.off();
      partiesRef.set({})
        .then(() => done())
        .catch(done);
    });

    it('should call removePartyListener when party is removed', () => {
      expect(spyRemovePartyListener.called).to.be.true;
      expect(spyRemovePartyListener.callCount).to.equal(1);
    });

    it('should call removePartyListener with the ID of the removed party', () => {
      expect(spyRemovePartyListener.calledWith(dillonsUserIdwhichisalsothepartyid)).to.equal(true);
    });
  });


  describe('createNewPartyListener function', () => {

    let spyMasterReorder;

    beforeEach('Create spy that wraps masterReorder', done => {
      spyMasterReorder = spy(firechief, "masterReorder");

      firechief.createPartyAddedListener();

      partiesRef.set(sampleParties)
      .then(() => {
        return partiesRef.child(dillonsUserIdwhichisalsothepartyid).update({ needSong: true })
      })
      .then(() => setTimeout( () => done(), 500 ) )
      .catch(done);
    });

    afterEach('clear spy and reset firebase', done => {
      spyMasterReorder.restore();
      partiesRef.off();
      partiesRef.set({})
        .then(() => done())
        .catch(done);
    });

    it('should call masterReorder when a party needs a song', () => {
      expect(spyMasterReorder.called).to.be.true;
      expect(spyMasterReorder.callCount).to.equal(1);
    });

    it('should call masterReorder with the ID of the party that needs a song', () => {
      expect(spyMasterReorder.calledWith(dillonsUserIdwhichisalsothepartyid)).to.equal(true);
    });
  });

});
