/* -----------------    ACTIONS     ------------------ */

const SET_CURRENT_SONG = 'SET_CURRENT_SONG';

/* ------------   ACTION CREATORS     ------------------ */

export const setCurrentSong = currentSong => ({
  type: SET_CURRENT_SONG,
  currentSong
})



/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_CURRENT_SONG:
        let currentSongArr = Object.keys(action.currentSong)
        if(currentSongArr.length !== 1) {
          return state
        } else {
          return action.currentSong[currentSongArr[0]]
        }

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
