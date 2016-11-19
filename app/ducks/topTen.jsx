/* -----------------    ACTIONS     ------------------ */

const SET_TOP_TEN = 'SET_TOP_TEN';
const APPEND_TO_TOP_TEN = 'APPEND_TO_TOP_TEN';

/* ------------   ACTION CREATORS     ------------------ */

export const setTopTen = topTen => ({
  type: SET_TOP_TEN,
  topTen
})

export const appendToTopTen = song => ({
  type: APPEND_TO_TOP_TEN,
  song
})


/* ------------       REDUCER     ------------------ */

const reducer = (state = [], action) => {
  switch (action.type){
    case SET_TOP_TEN:
        return action.topTen;
    case APPEND_TO_TOP_TEN:
    	return [...state, action.song]
    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
