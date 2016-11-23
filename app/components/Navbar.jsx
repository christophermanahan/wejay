import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { leaveParty } from '../ducks/global';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


/* -----------------    DUMB COMPONENT     ------------------ */


const DumbNavbar = props => {
  const { user, handleOpenDialog, handleCancel, handleLeaveParty, dialogOpen, partyName } = props;
  console.log("partyName: ", partyName);

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
        onTouchTap={handleLeaveParty}
      />,
    ];

  return (
    <div>
      <h2>WeJay</h2>
      <h3>Welcome DJ { user && user.displayName || 'Anon' }</h3>
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      >
        <MenuItem value="1">My Settings</MenuItem>
        <MenuItem value="2" onTouchTap={handleOpenDialog}>Leave Party</MenuItem>
        <MenuItem value="3">Logout</MenuItem>

      </IconMenu>
      <Dialog
        title={`Are you sure you want to leave ${partyName}?`}
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
    this.handleLeaveParty = this.handleLeaveParty.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOpenDialog() {
    this.setState({dialogOpen: true});
  }

  handleLeaveParty() {
    /*

    LOCAL
    CLEAR
      currentSong,
      DJs,
      topTen,
      personalQueue
    */
    const { uid } = this.props.user
    const { currentParty, firebase, leaveParty } = this.props
    const userPartiesRef = firebase.database().ref('user_parties').child(uid);
    const partyDjsRef = firebase.database().ref(currentParty.id).child(uid);

    userPartiesRef.remove()
    .then(err => {
      if(err){
        throw new Error(err)
      } else {
        return partyDjsRef.remove()
      }
    })
    .then(err => {
      if(err){
        throw new Error(err)
      } else {
        this.setState({dialogOpen: false});
        leaveParty()
        browserHistory.push('/parties');
      }
    })
    .catch(console.error)



  }

  handleCancel() {
    this.setState({dialogOpen: false});
  }

  render() {
    const { user, currentParty } = this.props
    return (
      <DumbNavbar
        user={user}
        handleOpenDialog={this.handleOpenDialog}
        handleLeaveParty={this.handleLeaveParty}
        handleCancel={this.handleCancel}
        dialogOpen={this.state.dialogOpen}
        partyName={currentParty.name}
      />
    );
  }
}




/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, firebase, currentParty }) => ({ user, firebase, currentParty });
const mapDispatchToProps = (dispatch) => ({
  leaveParty: () => dispatch(leaveParty())
})

const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarContainer;
