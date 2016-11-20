import React, { Component } from 'react';
import { connect } from 'react-redux';

import {MuiThemeProvider} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* -----------------    COMPONENT     ------------------ */

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return (
      <MuiThemeProvider>
        <div>
          { children }
        </div>
      </MuiThemeProvider>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase }) => ({ firebase });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
