import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { samplePersonalQueue } from '../utils';

describe('personalQueueReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().personalQueue).to.be.deep.equal({});
  });

  describe('SET_PERSONAL_QUEUE', () => {

    it('sets personalQueue to action.personal_queue', () => {
      testStore.dispatch({ type: 'SET_PERSONAL_QUEUE', personal_queue: samplePersonalQueue });
      const newState = testStore.getState();
      expect(newState.personalQueue).to.be.deep.equal(samplePersonalQueue);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the personal_queue when a user leaves a party', () => {
      testStore.dispatch({ type: 'SET_PERSONAL_QUEUE', personal_queue: samplePersonalQueue });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.personalQueue).to.be.deep.equal(samplePersonalQueue);
      expect(newState.personalQueue).to.be.deep.equal({});
    });

  });

});