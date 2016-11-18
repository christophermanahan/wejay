/* -----------------    ACTIONS     ------------------ */

const SET_MESSAGES = 'SET_MESSAGES'

/* ------------   ACTION CREATORS     ------------------ */

export const setMessages = messages => ({
  type: SET_MESSAGES,
  messages
})

/* ------------       REDUCER     ------------------ */

const reducer = (state = {}, action) => {
  switch (action.type){
    case SET_MESSAGES:
        return action.messages

    default:
        return state;
    }
};

/* ------------       DISPATCHERS     ------------------ */



export default reducer
