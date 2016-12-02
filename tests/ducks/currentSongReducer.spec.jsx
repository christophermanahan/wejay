import { expect } from 'chai';

import { createStore } from 'redux';
import mainReducer from '../../app/ducks/index';
import { sampleSong } from '../utils';

describe('currentSongReducer', () => {

  let testStore;
  beforeEach('Create testing store', () => {
    testStore = createStore(mainReducer);
  });

  it('has expected initial state', () => {
    expect(testStore.getState().currentSong).to.be.deep.equal({});
  });

  describe('SET_CURRENT_SONG', () => {

    it('sets currentSong to action.currentSong', () => {
      testStore.dispatch({ type: 'SET_CURRENT_SONG', currentSong: sampleSong });
      const newState = testStore.getState();
      expect(newState.currentSong).to.be.deep.equal(sampleSong);
    });

  });

  describe('LEAVE_PARTY', () => {

    it('clears the store when a user leaves the party', () => {
      testStore.dispatch({ type: 'SET_CURRENT_SONG', currentSong: sampleSong });
      const prevState = testStore.getState();
      testStore.dispatch({ type: 'LEAVE_PARTY' });
      const newState = testStore.getState();
      expect(prevState.currentSong).to.be.deep.equal(sampleSong);
      expect(newState.currentSong).to.be.deep.equal({});
    });

  });

});