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
          <MenuItem value="1" containerElement={<Link to="/" />}>Home</MenuItem>
          <MenuItem value="2" containerElement={<Link to="/app/search" />}>Search</MenuItem>
          <MenuItem value="3" containerElement={<Link to="/app/chat" />}>Chat</MenuItem>
          <MenuItem value="4" containerElement={<Link to="/app/songs" />}>Songs</MenuItem>

        </IconMenu>
      </div>
    );
  }
}

