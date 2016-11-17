import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Main from './components/Main'

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={Main} />
  </Router>
)
