import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';

import { fakeFirebase } from '../utils';

import Fireboss from '../../app/utils/fireboss'

const fireboss = new Fireboss(fakeFirebase, {}, {})

describe('firebossReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().fireboss).to.be.deep.equal({});
  });

  describe('SET_FIREBOSS', () => {

    it('sets fireboss on store using action.fireboss', () => {
      testStore.dispatch({ type: 'SET_FIREBOSS', fireboss: fireboss });
      const newState = testStore.getState();
      expect(newState.fireboss).to.be.deep.equal(fireboss);
    });

  });


});
