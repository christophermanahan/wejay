import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {MuiThemeProvider} from 'material-ui';


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
          { children }
        </div>
      </MuiThemeProvider>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase }) => ({ firebase });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
