import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleParties } from '../utils';

describe('partiesReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  })

  it('has the expected initial state', () => {
    expect(testStore.getState().parties).to.be.deep.equal({});
  });

  describe('SET_PARTIES', () => {

    it('sets parties to action.parties', () => {
      testStore.dispatch({ type: 'SET_PARTIES', parties: sampleParties });
      const newState = testStore.getState();
      expect(newState.parties).to.be.deep.equal(sampleParties);
    });

  });


})
