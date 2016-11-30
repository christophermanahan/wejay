import { LEAVE_PARTY } from './global';

/* -----------------    ACTIONS     ------------------ */

const SET_SHADOW_QUEUE = 'SET_SHADOW_QUEUE';

/* ------------   ACTION CREATORS     ------------------ */

export const setShadowQueue = songs => ({
  type: SET_SHADOW_QUEUE,
  songs
});

/* ------------       REDUCER     ------------------ */

const reducer = (state = [], action) => {
  switch (action.type){
    case SET_SHADOW_QUEUE:
      return action.songs;

    case LEAVE_PARTY:
      return {};

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */

export default reducer