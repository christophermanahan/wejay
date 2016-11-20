import React, { Component } from 'react';
import { Link } from 'react-router';
import Player from './Player';


/* -----------------    COMPONENT     ------------------ */

export default props => (
  <div>
    <Link to="/app/search">Search</Link>
    <Link to="/app/chat">Chat</Link>
    <Link to="/app/songs">Songs</Link>
    { props.children }
    <Player/>
  </div>
);
