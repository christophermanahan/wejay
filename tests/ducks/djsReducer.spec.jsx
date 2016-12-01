import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleDJs } from '../utils';

describe('djsReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().djs).to.be.deep.equal({});
  });

  describe('SET_djs', () => {

    it('sets djs to action.djs', () => {
      testStore.dispatch({ type: 'SET_DJS', djs: sampleDJs });
      const newState = testStore.getState();
      expect(newState.djs).to.be.deep.equal(sampleDJs);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the djs when a user leaves a party', () => {
      testStore.dispatch({ type: 'SET_DJS', djs: sampleDJs });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.djs).to.be.deep.equal(sampleDJs);
      expect(newState.djs).to.be.deep.equal({});
    });

  });

});