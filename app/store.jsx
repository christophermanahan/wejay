import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './ducks'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import persistState from 'redux-localstorage'

const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(createLogger(), thunkMiddleware), persistState("votes", {key: "votes"})
));

export default store
