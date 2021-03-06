import axios from 'axios'
import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

const LOAD_SEARCH_RESULTS = 'LOAD_SEARCH_RESULTS'

/* ------------   ACTION CREATORS     ------------------ */

export const loadSearchResults = searchResults => ({
  type: LOAD_SEARCH_RESULTS,
  searchResults
})

/* ------------       REDUCER     ------------------ */

const reducer = (state = [], action) => {
  switch (action.type){
    case LOAD_SEARCH_RESULTS:
        return action.searchResults

    case LEAVE_PARTY:
        return []

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */

export const fetchTrackResults = (query) => {
  return dispatch => {
    axios.get(`/api/search/tracks/${query}`)
    .then(results => {
      dispatch(loadSearchResults(results.data))
    })
  }
}

export default reducer
