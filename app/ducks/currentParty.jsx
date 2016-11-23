/* -----------------    ACTIONS     ------------------ */

const SET_CURRENT_PARTY = 'SET_CURRENT_PARTY';
const CLEAR_CURRENT_PARTY = 'CLEAR_CURRENT_PARTY';

/* ------------   ACTION CREATORS     ------------------ */

export const setCurrentParty = currentParty => ({
  type: SET_CURRENT_PARTY,
  currentParty
})

export const clearCurrentParty = () => ({
  type: CLEAR_CURRENT_PARTY
})


/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_CURRENT_PARTY:
      return action.currentParty

    case CLEAR_CURRENT_PARTY:
      return {}

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
