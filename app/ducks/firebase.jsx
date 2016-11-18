// import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_FIREBASE = 'SET_FIREBASE'

/* ------------   ACTION CREATORS     ------------------ */

export const setFirebase = firebase => ({
  type: SET_FIREBASE,
  firebase
})

/* ------------       REDUCER     ------------------ */

const reducer = (previousState = {}, action) => {

  switch (action.type) {
    case SET_FIREBASE:
      return action.firebase

    default:
	    return previousState;
  }
}

export default reducer
/* ------------       DISPATCHERS     ------------------ */
