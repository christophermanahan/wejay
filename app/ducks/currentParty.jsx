import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

export const SET_CURRENT_PARTY = 'SET_CURRENT_PARTY';

/* ------------   ACTION CREATORS     ------------------ */

export const setCurrentParty = currentParty => ({
  type: SET_CURRENT_PARTY,
  currentParty
})


/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_CURRENT_PARTY:
      return action.currentParty;

    case LEAVE_PARTY:
      return {};

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */

export default reducer;
