/* -----------------    ACTIONS     ------------------ */
const SET_FIREBOSS = 'SET_FIREBOSS'


/* ------------   ACTION CREATORS     ------------------ */

export const setFireboss = fireboss => ({
  type: SET_FIREBOSS,
  fireboss
})


/* ------------       REDUCER     ------------------ */

const reducer = (previousState = {}, action) => {

  switch (action.type) {
    case SET_FIREBOSS:
      return action.fireboss

    default:
      return previousState;
  }
}

export default reducer

