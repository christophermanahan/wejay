import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './components/Main'
import Chat from './components/Chat'
import Search from './components/Search'
import SongList from './components/SongList'

import { loadFirebase } from './onEnterHooks'

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={Main} onEnter={loadFirebase}>
      <Route path="/search" component={Search} />
      <Route path="/chat" component={Chat} />
      <Route path='/songs' component={SongList} />
    </Route>
  </Router>
)
