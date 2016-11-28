import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';
import muiTheme from '../utils/muiTheme';


import { Grid } from 'react-flexbox-grid/lib/index';


import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* -----------------    COMPONENT     ------------------ */

// if we want to use the custom theme, we specify muiTheme={muiTheme} in the provider component

export default props => {
  const { children } = props;
  return (
	  <MuiThemeProvider>
		  <Grid id="main-grid">
	      { children }
      </Grid>
	  </MuiThemeProvider>
  );
};
