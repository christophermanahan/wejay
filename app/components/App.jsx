import React, { Component } from 'react';
import { connect } from 'react-redux';

import Player from './Player';
import Navbar from './Navbar';


/* -----------------    COMPONENT     ------------------ */

const App = props => {
  const { children } = props;
  return (
      <div>
        <h1>bones has been gutted.</h1>
        <Navbar/>
          { children }
        <Player/>
      </div>
  );
};


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase }) => ({ firebase });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
