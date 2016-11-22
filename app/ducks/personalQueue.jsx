/* -----------------    ACTIONS     ------------------ */

const SET_PERSONAL_QUEUE = 'SET_PERSONAL_QUEUE';

/* ------------   ACTION CREATORS     ------------------ */

export const setPersonalQueue = personalQueue => ({
  type: SET_PERSONAL_QUEUE,
  personalQueue
})



/* ------------       REDUCER     ------------------ */

const reducer = (state = [], action) => {
  switch (action.type){
    case SET_PERSONAL_QUEUE:
        return action.personalQueue;

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
