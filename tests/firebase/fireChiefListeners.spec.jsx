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

    let spyCreateNewPartyListener, spyCreateTimePriorityIncrementer;

    before('Create spy that wraps createNewPartyListener', done => {
      spyCreateNewPartyListener = spy(firechief, "createNewPartyListener");
      spyCreateTimePriorityIncrementer = spy(firechief, "createTimePriorityIncrementer");

      firechief.createPartyAddedListener(500, 1000);

      partiesRef.child(idForNewSampleParty).set(sampleNewParty)
      .then(() => setTimeout( () => done(), 500 ) )
      .catch(done);
    });

    after('clear spy and reset firebase', done => {
      spyCreateNewPartyListener.restore();
      spyCreateTimePriorityIncrementer.restore();

      firechief.removeTimePriorityIncrementer(idForNewSampleParty, 'top_ten');
      firechief.removeTimePriorityIncrementer(idForNewSampleParty, 'shadow_queue');

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

    it('should call createTimePriorityIncrementer with the ID of the added party and the passed value', () => {
      expect(spyCreateTimePriorityIncrementer.calledWith(idForNewSampleParty, 500)).to.equal(true);
      expect(spyCreateTimePriorityIncrementer.calledWith(idForNewSampleParty, 1000)).to.equal(true);
      expect(spyCreateTimePriorityIncrementer.callCount).to.equal(2);
    });

  });


  describe('createPartyRemovedListener function', () => {

    let spyRemovePartyListener, spyRemoveTimePriorityIncrementer;

    before('Create spies that wrap removePartyListener and removeTimePriorityIncrementer', done => {
      spyRemovePartyListener = spy(firechief, "removePartyListener");
      spyRemoveTimePriorityIncrementer = spy(firechief, "removeTimePriorityIncrementer");

      firechief.createPartyRemovedListener();

      partiesRef.set(sampleParties)
      .then(() => {
        firechief.createTimePriorityIncrementer(dillonsUserIdwhichisalsothepartyid, 50000, 'top_ten');
        firechief.createTimePriorityIncrementer(dillonsUserIdwhichisalsothepartyid, 50000, 'shadow_queue');
      })
      .then(() => {
        return partiesRef.child(dillonsUserIdwhichisalsothepartyid).remove();
      })
      .then(() => setTimeout( () => done(), 500 ) )
      .catch(done);
    });

    after('clear spy and reset firebase', done => {
      spyRemovePartyListener.restore();
      spyRemoveTimePriorityIncrementer.restore();
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

    it('should call removeTimePriorityIncrementer with the ID of the removed party and top_ten, shadow_queue', () => {
      expect(spyRemoveTimePriorityIncrementer.calledWith(dillonsUserIdwhichisalsothepartyid, 'shadow_queue')).to.equal(true);
      expect(spyRemoveTimePriorityIncrementer.calledWith(dillonsUserIdwhichisalsothepartyid, 'top_ten')).to.equal(true);
      expect(spyRemoveTimePriorityIncrementer.callCount).to.equal(2);
    });
  });


  describe('createNewPartyListener function', () => {

    let spyMasterReorder, spyRemoveWorstSong;

    before('Create spies that wrap masterReorder and removeWorstSong', done => {
      spyMasterReorder = spy(firechief, 'masterReorder');
      spyRemoveWorstSong = spy(firechief, 'removeWorstSong');

      firechief.createPartyAddedListener();

      partiesRef.set(sampleParties)
      .then(() => {
        console.log("MARK 1")
        return partiesRef.child(dillonsUserIdwhichisalsothepartyid).update({ needSong: true });
      })
      .then(() => {
        return new Promise((res, rej) => {
          setTimeout(res, 500);  // leave time to register listen
        });
      })
      .then(() => {
        console.log("MARK 2")
        return partiesRef.child(dillonsUserIdwhichisalsothepartyid).update({ songToRemove: 'badsong' });
      })
      .then(() => {
        return new Promise((res, rej) => {
          setTimeout(res, 500);  // leave time to register listen
        });
      })
      .then(() => {
        done();
      })
      .catch(done);
    });

    after('clear spy and reset firebase', done => {
      spyMasterReorder.restore();
      spyRemoveWorstSong.restore();
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
      expect(spyMasterReorder.calledWith(dillonsUserIdwhichisalsothepartyid)).to.be.true;
    });

    it('should call removeWorstSong when a song is too terrible', () => {
      expect(spyRemoveWorstSong.called).to.be.true;
      expect(spyRemoveWorstSong.callCount).to.equal(1);
    });

    it('should call removeWorstSong with the ID of the party and the bad song\'s id', () => {
      expect(spyRemoveWorstSong.calledWith(dillonsUserIdwhichisalsothepartyid, 'badsong')).to.be.true;
    });

  });

});
