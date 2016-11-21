/* -----------------    ACTIONS     ------------------ */

const SET_PARTIES = 'SET_PARTIES';

/* ------------   ACTION CREATORS     ------------------ */

export const setParties = parties => ({
  type: SET_PARTIES,
  parties
})



/* ------------       REDUCER     ------------------ */

const reducer = (state = [], action) => {
  switch (action.type){
    case SET_PARTIES:
        return action.parties;

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
