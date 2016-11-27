/* -----------------    ACTIONS     ------------------ */

const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

/* ------------   ACTION CREATORS     ------------------ */

export const setUser = user => ({
  type: SET_USER,
  user
});

export const clearUser = () => ({
  type: CLEAR_USER
});

/* ------------       REDUCER     ------------------ */

const reducer = (previousState = {}, action) => {

  switch (action.type) {
    case SET_USER:
      return action.user;

     case CLEAR_USER:
     	return {};

    default:
			return previousState;
  }
};

export default reducer;

/* ------------       DISPATCHERS     ------------------ */
