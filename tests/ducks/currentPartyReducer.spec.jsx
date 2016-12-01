import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleParty } from '../utils';

describe('currentPartyReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().currentParty).to.be.deep.equal({});
  });

  describe('SET_CURRENT_PARTY', () => {

    it('sets current party to action.currentParty', () => {
      testStore.dispatch({ type: 'SET_CURRENT_PARTY', currentParty: sampleParty });
      const newState = testStore.getState();
      expect(newState.currentParty).to.be.deep.equal(sampleParty);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the store when a user leaves the party', () => {
      testStore.dispatch({ type: 'SET_CURRENT_PARTY', currentParty: sampleParty });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.currentParty).to.be.deep.equal(sampleParty);
      expect(newState.currentParty).to.be.deep.equal({});
    });

  });

});
