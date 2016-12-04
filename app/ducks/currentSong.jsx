import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG';

/* ------------   ACTION CREATORS     ------------------ */

export const setCurrentSong = currentSong => ({
  type: SET_CURRENT_SONG,
  currentSong
})



/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_CURRENT_SONG:
      return action.currentSong;

    case LEAVE_PARTY:        //if you try to leave, soundCloudPlayer still needs url (edge case for host)
      return {}

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
