// import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_AUTH = 'SET_AUTH';

/* ------------   ACTION CREATORS     ------------------ */

export const setAuth = auth => ({
  type: SET_AUTH,
  auth
});

/* ------------       REDUCER     ------------------ */

const reducer = (previousState = {}, action) => {

  switch (action.type) {
    case SET_AUTH:
      return action.auth;

    default:
			return previousState;
  }
};

export default reducer;

/* ------------       DISPATCHERS     ------------------ */
