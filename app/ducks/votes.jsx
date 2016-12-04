import { SET_CURRENT_PARTY } from './currentParty';

/* -----------------    ACTIONS     ------------------ */

const DECREMENT_VOTES = 'DECREMENT_VOTES';

/* ------------   ACTION CREATORS     ------------------ */

export const decrementVotes = () => ({
  type: DECREMENT_VOTES
});

/* ------------       REDUCER     ------------------ */

const reducer = (previousState = 5, action) => {

  switch (action.type) {
    case SET_CURRENT_PARTY:
      return (action.currentParty.needSong) ? 5 : previousState

     case DECREMENT_VOTES:
     	return (previousState > 0) ? previousState - 1 : 0

    default:
			return previousState;
  }
};

export default reducer;

/* ------------       DISPATCHERS     ------------------ */
