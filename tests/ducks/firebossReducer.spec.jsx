import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';

import { fakeFirebase } from '../utils';

import Fireboss from '../../app/utils/fireboss'


describe('firebossReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().firebase).to.be.deep.equal({});
  });

  describe('SET_FIREBASE', () => {

    it('sets fireboss on store using action.firebase', () => {
      testStore.dispatch({ type: 'SET_FIREBASE', firebase: fakeFirebase });
      const newState = testStore.getState();
      expect(newState.firebase).to.be.deep.equal(fakeFirebase);
      const testFireboss = new Fireboss(fakeFirebase)
      expect(newState.fireboss).to.be.deep.equal(testFireboss);

    });

  });


});
