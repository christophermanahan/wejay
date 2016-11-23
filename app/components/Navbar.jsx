import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


/* -----------------    DUMB COMPONENT     ------------------ */


const DumbNavbar = props => {
  const { user, handleOpenDialog, handleCancel, handleLogout, dialogOpen } = props;

  const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleCancel}
      />,
      <FlatButton
        label="Confirm Leave"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleLogout}
      />,
    ];

  return (
    <div>
      <h2>weeJay</h2>
      <h3>Welcome DJ { user && user.displayName || 'Anon' }</h3>
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      >
        <MenuItem value="1">My Settings</MenuItem>
        <MenuItem value="2">Leave Party</MenuItem>
        <MenuItem value="3" onTouchTap={handleOpenDialog}>Logout</MenuItem>

      </IconMenu>
      <Dialog
        title="Here is our Dialog title!"
        actions={actions}
        modal={false}
        open={dialogOpen}
        onRequestClose={handleCancel}
      />
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false
    };

    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOpenDialog() {
    this.setState({dialogOpen: true});
  }

  handleLogout() {
    // firebase . stuff
    this.setState({dialogOpen: false});
  }

  handleCancel() {
    this.setState({dialogOpen: false});
  }

  render() {
    const { uid, party_id } = this.props;
    return (
      <DumbNavbar
        uid={uid}
        party_id={party_id}
        handleOpenDialog={this.handleOpenDialog}
        handleLogout={this.handleLogout}
        handleCancel={this.handleCancel}
        dialogOpen={this.state.dialogOpen}
      />
    );
  }
}




/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, firebase }) => ({ user, firebase });
const NavbarContainer = connect(mapStateToProps)(Navbar);

export default NavbarContainer;
