/* -----------------    ACTIONS     ------------------ */

import { SET_FIREBASE } from './firebase'
import Fireboss from '../utils/fireboss'


/* ------------       REDUCER     ------------------ */

const reducer = (previousState = {}, action) => {

  switch (action.type) {
    case SET_FIREBASE:
      let fireboss = new Fireboss(action.firebase)
      return fireboss

    default:
      return previousState;
  }
}

export default reducer

