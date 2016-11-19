import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {MuiThemeProvider} from 'material-ui';
import Player from './Player'


/* -----------------    COMPONENT     ------------------ */

class Main extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    const { children } = this.props
    return (
      <MuiThemeProvider>
        <div>
          <h1>bones has been gutted.</h1>
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/songs">Songs</Link>
          { children }
          <Player/>
        </div>
      </MuiThemeProvider>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase }) => ({ firebase });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
