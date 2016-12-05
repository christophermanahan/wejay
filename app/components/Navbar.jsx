import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import {IconButton, MenuItem, IconMenu} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Drawer from 'material-ui/Drawer';


/*

<IconMenu
  iconButtonElement={
    <IconButton style={{height: "100%"}}>
      <MoreVertIcon />
    </IconButton>}
  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  targetOrigin={{horizontal: 'right', vertical: 'top'}}
  iconStyle={{ color: '#363836', height: '50px', width: '50px' }}
  menuStyle={{ backgroundColor: 'white', width: '8em' }}
>
  <MenuItem style={menuDropUpStyle} value="1"><ArrowDropUp/></MenuItem>
  <MenuItem style={menuItemStyle} value="2">My Settings</MenuItem>
  <MenuItem style={menuItemStyle} value="3" onTouchTap={handleOpenLeaveDialog}>Leave Party</MenuItem>
  <MenuItem style={menuItemStyle} value="4" onTouchTap={handleOpenLogoutDialog}>Logout</MenuItem>
</IconMenu>

*/



/* -----------------    DUMB COMPONENT     ------------------ */


const DumbNavbar = props => {
  const { dialogOpenLeave, dialogOpenLogout, user, handleOpenLeaveDialog, handleOpenLogoutDialog, handleCancel, handleLeaveParty, handleLogout, partyName, handleLeaveCancel, handleLogoutCancel, handleDrawerToggle, handleDrawerClose, drawerOpen } = props;

  const menuDropUpStyle = {fontSize: '1em', marginLeft: '7em'};
  const menuItemStyle = {fontSize: '1em', backgroundColor: 'white'};
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

  const albumIconStyle = {fontSize: '8em'};

  return (
    <div>
      <Row className="safari_only" id="navbar-row">
        <Col xs={2} className="navbar-col">
          <icon style={albumIconStyle} className="zmdi zmdi-album zmdi-hc-4x" />
        </Col>
        <Col xs={8}>
          <div>
            <h2 id="wejay-nav-logo">weJay</h2>
          </div>
        </Col>
        <Col xs={1} className="navbar-col">
          <div className="navbar-icon-container">

            <IconButton style={{height: "100%"}}>
              <MoreVertIcon onTouchTap={handleDrawerToggle} />
            </IconButton>

            <Drawer

              openSecondary={true}
              docked={false}
              width={225}
              open={drawerOpen}
              onRequestChange={handleDrawerToggle}
            >
              <MenuItem onTouchTap={handleDrawerClose}>Menu Item</MenuItem>
              <MenuItem onTouchTap={handleDrawerClose}>Menu Item 2</MenuItem>

              <MenuItem style={menuDropUpStyle} onTouchTap={handleDrawerClose} value="1"><ArrowDropUp/></MenuItem>
              <MenuItem style={menuItemStyle} value="3" onTouchTap={handleOpenLeaveDialog}>Leave Party</MenuItem>
              <MenuItem style={menuItemStyle} value="4" onTouchTap={handleOpenLogoutDialog}>Logout</MenuItem>
            </Drawer>





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
      dialogOpenLogout: false,
      drawerOpen: false
    };

    this.handleOpenLeaveDialog = this.handleOpenLeaveDialog.bind(this);
    this.handleOpenLogoutDialog = this.handleOpenLogoutDialog.bind(this);
    this.handleLeaveParty = this.handleLeaveParty.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLeaveCancel = this.handleLeaveCancel.bind(this);
    this.handleLogoutCancel = this.handleLogoutCancel.bind(this);

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }


  // handleDrawerToggle = () => this.setState({drawerOpen: !this.state.open});
  handleDrawerToggle = () => this.setState({drawerOpen: true});

  handleDrawerClose = () => this.setState({drawerOpen: false});

  handleOpenLeaveDialog() {
    this.setState({dialogOpenLeave: true});
  }

  handleOpenLogoutDialog() {
    this.setState({dialogOpenLogout: true});
  }

  handleLogout() {
    const { user, currentParty, fireboss } = this.props
    const partyId = currentParty.id

    fireboss.logOut(partyId, user)
  }

  handleLeaveParty() {
    const { user, currentParty, fireboss } = this.props
    const partyId = currentParty.id

    fireboss.userLeaveParty(partyId, user)
  }


  handleLeaveCancel() {
    this.setState({dialogOpenLeave: false});
  }

  handleLogoutCancel() {
    this.setState({dialogOpenLogout: false});
  }


  render() {
    const { user, currentParty } = this.props
    let partyName = currentParty && currentParty.name
    return (
      <DumbNavbar
        user={user}
        handleDrawerToggle={this.handleDrawerToggle}
        handleDrawerClose={this.handleDrawerClose}
        drawerOpen={this.state.drawerOpen}
        handleOpenLeaveDialog={this.handleOpenLeaveDialog}
        handleOpenLogoutDialog={this.handleOpenLogoutDialog}
        handleLeaveCancel={this.handleLeaveCancel}
        handleLogoutCancel={this.handleLogoutCancel}
        handleLeaveParty={this.handleLeaveParty}
        handleLogout={this.handleLogout}
        partyName={partyName}
        dialogOpenLogout={this.state.dialogOpenLogout}
        dialogOpenLeave={this.state.dialogOpenLeave}
      />
    );
  }
}




/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, fireboss, currentParty }) => ({ user, fireboss, currentParty });

const NavbarContainer = connect(mapStateToProps)(Navbar);

export default NavbarContainer;
