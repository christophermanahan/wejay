import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';


import { Grid } from 'react-flexbox-grid/lib/index';


import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* -----------------    COMPONENT     ------------------ */

export default props => {
  const { children } = props;
  return (
	  <MuiThemeProvider>
	    <Grid style={{width: '99vw', height: '99vh'}} fluid>
	      { children }
	    </Grid>
	  </MuiThemeProvider>
  );
};
