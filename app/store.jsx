import { createStore, applyMiddleware } from 'redux'
import rootReducer from './ducks'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(createLogger(), thunkMiddleware))

export default store
