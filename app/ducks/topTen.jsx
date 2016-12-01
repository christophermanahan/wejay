import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

const SET_TOP_TEN = 'SET_TOP_TEN';

/* ------------   ACTION CREATORS     ------------------ */

export const setTopTen = topTen => ({
  type: SET_TOP_TEN,
  topTen
})

/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_TOP_TEN:
        return action.topTen;

    case LEAVE_PARTY:
      return {}

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
