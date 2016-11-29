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

  const menuItemStyle = {fontSize: '1em'};
  const dialogTitleStyle = {fontSize: '1.5em', lineHeight: '1.2em', color: '#363836'};
  const actionStyle = {width: '7em', height: '2.5em'};
  const actionLabelStyleCancel = {fontSize: '1em', color: '#7aa095'};
  const actionLabelStyleConfirm = {fontSize: '1em', color: '#ec4616'};

  const leaveActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleLeaveCancel}
        style={actionStyle}
        labelStyle={actionLabelStyleCancel}
      />,
      <FlatButton
        label="Leave"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleLeaveParty}
        style={actionStyle}
        labelStyle={actionLabelStyleConfirm}
      />,
    ];

  const logoutActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleLogoutCancel}
        style={actionStyle}
        labelStyle={actionLabelStyleCancel}
      />,
      <FlatButton
        label="Logout"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleLogout}
        style={actionStyle}
        labelStyle={actionLabelStyleConfirm}
      />,
    ];

  return (
    <div>
      <Row id="navbar-row">
        <Col xs={2} className="navbar-col">
          <div className="navbar-icon-container">
            <icon id="album-icon" className="zmdi zmdi-album zmdi-hc-4x" />
          </div>
        </Col>
        <Col xs={8} className="navbar-col">
          <div>
            <h2>weJay</h2>
          </div>
        </Col>
        <Col xs={1} className="navbar-col">
          <div className="navbar-icon-container">
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              iconStyle={{ color: '#363836', height: '50px', width: '50px' }}
              menuStyle={{ backgroundColor: '#ec4616', width: '8em' }}
            >
              <MenuItem style={menuItemStyle} value="1">My Settings</MenuItem>
              <MenuItem style={menuItemStyle} value="2" onTouchTap={handleOpenLeaveDialog}>Leave Party</MenuItem>
              <MenuItem style={menuItemStyle} value="3" onTouchTap={handleOpenLogoutDialog}>Logout</MenuItem>
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
          titleStyle={dialogTitleStyle}
        />
        <Dialog
          title={`If you logout you will leave the party and lose your DJ points. Do you want to logout?`}
          actions={logoutActions}
          modal={false}
          open={dialogOpenLogout}
          onRequestClose={handleLogoutCancel}
          titleStyle={dialogTitleStyle}
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
    const { currentParty, fireboss, leaveParty, clearUser, user } = this.props
    const { uid } = user
    const partyId = currentParty.id

    if(partyId === uid) {
      console.log("you can't leave host bro")
      fireboss.endParty(partyId)
    }
    else {
      fireboss.removeUserParty(partyId, user)
        .then(err => {
          if(err){
            throw new Error(err)
          } else {
            return fireboss.removePartyDj(partyId, user)
          }
        })
        .then(err => {
          if(err){
            throw new Error(err)
          } else {
            // this.setState({dialogOpenLeave: false})
            fireboss.removePartyListeners(partyId, user)
            leaveParty();
            clearUser();
            fireboss.auth.signOut()
              .then(() => {browserHistory.push('/login')},
                    () =>{console.log('error')}
              )
          }
        })
        .catch(console.error)
    }
  }



  handleLeaveParty() {
    const { currentParty, fireboss, leaveParty, user } = this.props
    const { uid } = user
    const partyId = currentParty.id

    if(partyId === uid) {
      console.log("you can't leave host bro")
      fireboss.endParty(partyId)
      browserHistory.push('/parties');
    }
    else {
      fireboss.removeUserParty(partyId, user)
        .then(err => {
            if(err){
              throw new Error(err)
            } else {
              return fireboss.removePartyDj(partyId, user)
            }
          })
          .then(err => {
            if(err){
              throw new Error(err)
            } else {
              // this.setState({dialogOpenLeave: false});
              fireboss.removePartyListeners(partyId, user)
              leaveParty()
              browserHistory.push('/parties');
            }
          })
        .catch(console.error)
    }

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

const mapStateToProps = ({ user, firebase, fireboss, currentParty }) => ({ user, firebase, fireboss, currentParty });
const mapDispatchToProps = (dispatch) => ({
  leaveParty: () => dispatch(leaveParty()),
  clearUser: () => dispatch(clearUser())
})

const NavbarContainer = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarContainer;
