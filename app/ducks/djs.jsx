/* -----------------    ACTIONS     ------------------ */

const SET_DJS = 'SET_DJS';

/* ------------   ACTION CREATORS     ------------------ */

export const setDjs = djs => ({
  type: SET_DJS,
  djs
})



/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_DJS:
        return action.djs;

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
