import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './components/Main'
import Chat from './components/Chat'

import { loadFirebase } from './onEnterHooks'

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={Main} onEnter={loadFirebase}>
      <Route path="/chat" component={Chat} />
    </Route>
  </Router>
)
