import React, { Component } from 'react';
import {MuiThemeProvider} from 'material-ui';


import { Grid } from 'react-flexbox-grid';


import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* -----------------    COMPONENT     ------------------ */

export default props => {
  const { children } = props;
  return (
		<Grid>
	    <MuiThemeProvider>
	      { children }
	    </MuiThemeProvider>
    </Grid>
  );
};
