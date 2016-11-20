import React, {Component} from 'react';
import { Link } from 'react-router';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


/* -----------------    COMPONENT     ------------------ */


export default class Navbar extends Component {


  render() {
    return (
      <div>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        >
          <Link to="/"><MenuItem value="1">Home</MenuItem></Link>
          <Link to="Search"><MenuItem value="2">Search</MenuItem></Link>
          <Link to="Chat"><MenuItem value="3">Chat</MenuItem></Link>
          <Link to="Songs"><MenuItem value="4">Songs</MenuItem></Link>

        </IconMenu>

      </div>
    );
  }
}
