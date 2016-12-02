import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleSearchResults } from '../utils';

describe('searchResultsReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().searchResults).to.be.deep.equal([]);
  });

  describe('LOAD_SEARCH_RESULTS', () => {

    it('sets searchResults to action.searchResults', () => {
      testStore.dispatch({ type: 'LOAD_SEARCH_RESULTS', searchResults: sampleSearchResults });
      const newState = testStore.getState();
      expect(newState.searchResults).to.be.deep.equal(sampleSearchResults);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the store when a user leaves the party', () => {
      testStore.dispatch({ type: 'LOAD_SEARCH_RESULTS', searchResults: sampleSearchResults });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.searchResults).to.be.deep.equal(sampleSearchResults);
      expect(newState.searchResults).to.be.deep.equal([]);
    });

  });

});