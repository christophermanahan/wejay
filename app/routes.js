import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import Main from './components/Main';
import Chat from './components/Chat';
import Search from './components/Search';
import SongList from './components/SongList';
import Login from './components/Login';
import App from './components/App';

import { loadFirebase } from './onEnterHooks';

export default () => (
  <Router history={browserHistory}>
	    <Route path="/" component={Main} onEnter={loadFirebase}>
	      <IndexRedirect to="/login" />
	      <Route path="/app" component={App}>
		      <Route path="/app/search" component={Search} />
		      <Route path="/app/chat" component={Chat} />
		      <Route path="/app/songs" component={SongList} />
	      </Route>
	      <Route path="/login" component={Login} />
			</Route>
  </Router>
);
