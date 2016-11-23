import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

const SET_PERSONAL_QUEUE = 'SET_PERSONAL_QUEUE';

/* ------------   ACTION CREATORS     ------------------ */

export const setPersonalQueue = personal_queue => ({
  type: SET_PERSONAL_QUEUE,
  personal_queue
})

/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_PERSONAL_QUEUE:
        return action.personal_queue;

    case LEAVE_PARTY:
      return {}

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer;
