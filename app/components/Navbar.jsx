import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { leaveParty } from '../ducks/global';
import { clearUser } from '../ducks/user';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';



/* -----------------    DUMB COMPONENT     ------------------ */


const DumbNavbar = props => {
  const { dialogOpenLeave, dialogOpenLogout, user, handleOpenLeaveDialog, handleOpenLogoutDialog, handleCancel, handleLeaveParty, handleLogout, partyName, handleLeaveCancel, handleLogoutCancel } = props;

  const leaveActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleLeaveCancel}
      />,
      <FlatButton
        label="Confirm Leave"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleLeaveParty}
      />,
    ];

  const logoutActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleLogoutCancel}
      />,
      <FlatButton
        label="Confirm Leave"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleLogout}
      />,
    ];


  //override material ui's inline style elements
	let logoTextStyle = {
    fontSize: "140px",
    marginBottom: "20px"
  };
  let logoImgStyle = {
    fontSize: "240px"
  };


  return (
    <div>
      <Row id="navbar-row">
        <Col xs={3} className="navbar-col">
          <div className="navbar-icon">
            <icon style={logoImgStyle} className="zmdi zmdi-album zmdi-hc-lg" />
          </div>
        </Col>
        <Col xs={8} className="navbar-col">
          <div>
            <h2 style={logoTextStyle}>weJay</h2>
          </div>
        </Col>
        <Col xs={1} className="navbar-col">
          <div className="navbar-icon">
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle={{ color: '#363836', width: '60px', height: '60px' }}
              menuStyle={{ backgroundColor: '#ec4616', fontSize: '1em' }}

            >
              <MenuItem value="1">My Settings</MenuItem>
              <MenuItem value="2" onTouchTap={handleOpenLeaveDialog}>Leave Party</MenuItem>
              <MenuItem value="3" onTouchTap={handleOpenLogoutDialog}>Logout</MenuItem>

            </IconMenu>
          </div>
        </Col>
      </Row>
      <Row>
        <Dialog
          title={`Are you sure you want to leave ${partyName}?`}
          actions={leaveActions}
          modal={false}
          open={dialogOpenLeave}
          onRequestClose={handleLeaveCancel}
        />
        <Dialog
          title={`If you logout you will leave the party and lose your DJ points. Do you want to logout?`}
          actions={logoutActions}
          modal={false}
          open={dialogOpenLogout}
          onRequestClose={handleLogoutCancel}
        />
      </Row>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpenLeave: false,
      dialogOpenLogout: false
    };

    this.handleOpenLeaveDialog = this.handleOpenLeaveDialog.bind(this);
    this.handleOpenLogoutDialog = this.handleOpenLogoutDialog.bind(this);
    this.handleLeaveParty = this.handleLeaveParty.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLeaveCancel = this.handleLeaveCancel.bind(this);
    this.handleLogoutCancel = this.handleLogoutCancel.bind(this);
  }

  handleOpenLeaveDialog() {
    this.setState({dialogOpenLeave: true});
  }

  handleOpenLogoutDialog() {
    this.setState({dialogOpenLogout: true});
  }




  handleLogout() {

    // const { uid } = this.props.user
    // const { currentParty } = this.props
    // let isPartyHost;
    //
    // (uid === currentParty.id) ? isPartyHost = true : isPartyHost = false
    // console.log("isPartyHost: ", isPartyHost);
    // console.log("LOGOUT MADE IT ");



    const { uid } = this.props.user
    const { currentParty, firebase, leaveParty, clearUser } = this.props
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
        this.setState({dialogOpenLeave: false});
        leaveParty();
        clearUser();
        browserHistory.push('/login');
      }
    })
    .catch(console.error)
  }



  handleLeaveParty() {

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
        this.setState({dialogOpenLeave: false});
        leaveParty()
        browserHistory.push('/parties');
      }
    })
    .catch(console.error)
  }


  handleLeaveCancel() {
    this.setState({dialogOpenLeave: false});
  }

  handleLogoutCancel() {
    this.setState({dialogOpenLogout: false});
  }


  render() {
    const { user, currentParty } = this.props
    return (
      <DumbNavbar
        user={user}
        handleOpenLeaveDialog={this.handleOpenLeaveDialog}
        handleOpenLogoutDialog={this.handleOpenLogoutDialog}
        handleLeaveCancel={this.handleLeaveCancel}
        handleLogoutCancel={this.handleLogoutCancel}
        handleLeaveParty={this.handleLeaveParty}
        handleLogout={this.handleLogout}
        partyName={currentParty.name}
        dialogOpenLogout={this.state.dialogOpenLogout}
        dialogOpenLeave={this.state.dialogOpenLeave}
      />
    );
  }
}




/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, firebase, currentParty }) => ({ user, firebase, currentParty });
const mapDispatchToProps = (dispatch) => ({
  leaveParty: () => dispatch(leaveParty()),
  clearUser: () => dispatch(clearUser())
})

const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarContainer;
