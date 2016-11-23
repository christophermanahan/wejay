import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


/* -----------------    COMPONENT     ------------------ */


const Navbar = props => {
  const { user } = props;

  return (
    <div>
      <h2>weJay</h2>
      <h3>Welcome DJ { user.displayName || 'Anon' }</h3>
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      >
        <MenuItem value="1">My Settings</MenuItem>
        <MenuItem value="2">Leave Party</MenuItem>
        <MenuItem value="3">Logout</MenuItem>
        
      </IconMenu>
    </div>
  );
}

const mapStateToProps = ({ user }) => ({ user });
const NavbarContainer = connect(mapStateToProps)(Navbar);

export default NavbarContainer;