import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleShadowQueue } from '../utils';

describe('shadowQueueReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().shadowQueue).to.be.deep.equal({});
  });

  describe('SET_SHADOW_QUEUE', () => {

    it('sets shadowQueue to action.songs', () => {
      testStore.dispatch({ type: 'SET_SHADOW_QUEUE', songs: sampleShadowQueue });
      const newState = testStore.getState();
      expect(newState.shadowQueue).to.be.deep.equal(sampleShadowQueue);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the store when a user leaves the party', () => {
      testStore.dispatch({ type: 'SET_SHADOW_QUEUE', songs: sampleShadowQueue });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.shadowQueue).to.be.deep.equal(sampleShadowQueue);
      expect(newState.shadowQueue).to.be.deep.equal({});
    });

  });

});