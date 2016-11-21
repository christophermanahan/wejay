import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* -----------------    COMPONENT     ------------------ */

export default props => {
  const { children } = props;
  return (
    <MuiThemeProvider>
      <div>
        { children }
      </div>
    </MuiThemeProvider>
  );
};
