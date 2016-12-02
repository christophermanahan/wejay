import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleTopTen } from '../utils';

describe('topTenReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().topTen).to.be.deep.equal({});
  });

  describe('SET_TOP_TEN', () => {

    it('sets top ten to action.topTen', () => {
      testStore.dispatch({ type: 'SET_TOP_TEN', topTen: sampleTopTen });
      const newState = testStore.getState();
      expect(newState.topTen).to.be.deep.equal(sampleTopTen);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the store when a user leaves the party', () => {
      testStore.dispatch({ type: 'SET_TOP_TEN', topTen: sampleTopTen });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.topTen).to.be.deep.equal(sampleTopTen);
      expect(newState.topTen).to.be.deep.equal({});
    });

  });

});
