import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleUser } from '../utils';

describe('userReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().user).to.be.deep.equal({});
  });

  describe('SET_USER', () => {

    it('sets user to action.user', () => {
      testStore.dispatch({ type: 'SET_USER', user: sampleUser });
      const newState = testStore.getState();
      expect(newState.user).to.be.deep.equal(sampleUser);
    });

  });

  describe('CLEAR_USER', () => {

    it('clears a user after logout', () => {
      testStore.dispatch({ type: 'SET_USER', user: sampleUser });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'CLEAR_USER' });
      const newState = testStore.getState();
      expect(prevState.user).to.be.deep.equal(sampleUser);
      expect(newState.user).to.be.deep.equal({});
    });

  });

});