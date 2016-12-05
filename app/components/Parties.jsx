import React, {Component} from 'react';
import { connect } from 'react-redux';

import { RaisedButton, TextField, AutoComplete, Dialog, FlatButton  } from 'material-ui';

import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, onPartySelect, joinParty, onSubmit, onPartyNameType, onPartyLocationType,
        dialogOpen, validationMsg, onDialogClose, name, logoutDialogOpen, toggleLogoutDialog, handleLogout  } = props;

  //override material ui's inline style elements
  const btnStyle = { minWidth: "50%"};
  const textFieldStyle = { color: "#363836", width: "98%", margin: "0.2em"};
  const actionLabelStyleCancel = {fontSize: '1em', color: '#7aa095'};
  const actionLabelStyleLogout = {fontSize: '1em', color: '#ec4616'};

  let autofillArr = [];

  for (let index in parties) {
    autofillArr.push({textKey: parties[index].name, valueKey: parties[index].id});
  }

  const autofillConfig = {
    text: 'textKey',
    value: 'valueKey'
  };

  const dialogActions = [
    <RaisedButton
      label="OK"
      primary={true}
      onTouchTap={onDialogClose}
    />
  ];

  const logoutDialogActions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={toggleLogoutDialog}
      labelStyle={actionLabelStyleCancel}
    />,
    <FlatButton
      label="Logout"
      primary={true}
      onTouchTap={handleLogout}
      labelStyle={actionLabelStyleLogout}
    />
  ];

  const logoutStyle = {color: "#dae2df", backgroundColor: "#363836", fontSize: "0.8em"}

  return (
    <Row id="login-grad" className="party-container">
      <Col xsOffset={1} xs={10}>
        <Row>
          <Col xs={12}>
            <h1 id="parties-title">weJay</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h2 className="party-header">Join Party</h2>
          </Col>
        </Row>
        <Row>
          <Col xsOffset={1} xs={10}>
            <AutoComplete
              floatingLabelText="Find your party..."
              filter={AutoComplete.fuzzyFilter}
              openOnFocus={true}
              dataSource={autofillArr}
              dataSourceConfig={autofillConfig}
              onNewRequest={onPartySelect}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <RaisedButton
              className="party-btn"
              primary={true}
              style={btnStyle}
              backgroundColor="#7aa095"
              labelColor="#ffffff"
              label="Join"
              onTouchTap={joinParty}
              />
            <h2 className="party-header party-header-create">Create Party</h2>
            <form onSubmit={onSubmit}>
              <TextField
                id="name"
                style={textFieldStyle}
                floatingLabelText="Party Name"
                onChange={onPartyNameType}
                />
              <TextField
                id="location"
                style={textFieldStyle}
                floatingLabelText="Party Location"
                onChange={onPartyLocationType}
                />
              <RaisedButton
                className="party-btn"
                style={btnStyle}
                backgroundColor="#ec4616"
                labelColor="#ffffff"
                type="submit"
                label="Start"
                />
            </form>
            <Dialog
              title="Whoops!"
              open={dialogOpen}
              modal={true}
              actions={dialogActions}
            >{ validationMsg }</Dialog>
            <Dialog
              title="Are you sure you want to logout?"
              open={logoutDialogOpen}
              modal={true}
              actions={logoutDialogActions}
            >{ validationMsg }</Dialog>
          </Col>
        </Row>
        <Row>
          <Col xs={10} xsOffset={1}>
            <h3 className="logout-txt">Signed in as {name}</h3>
            <div className="parties-logout-container">
              <FlatButton style={logoutStyle} label="Logout" onTouchTap={toggleLogoutDialog} />
            </div>
          </Col>
        </Row>
      </Col>
    </Row>

  );
};


/* -----------------    STATEFUL REACT COMPONENT     ------------------ */
class Parties extends Component {
  constructor(props) {
    super(props);
    this.onPartySelect = this.onPartySelect.bind(this);
    this.joinParty = this.joinParty.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onPartyNameType = this.onPartyNameType.bind(this);
    this.onPartyLocationType = this.onPartyLocationType.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.toggleLogoutDialog = this.toggleLogoutDialog.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      partyId: '',
      newPartyName: '',
      newPartyLocation: '',
      dialogOpen: false,
      logoutDialogOpen: false,
      validationMsgArr: []
    };

  }

  joinParty(evt) {
    evt.preventDefault();
    const { user, fireboss } = this.props;
    const { partyId } = this.state;

    if (!partyId) { return; }
    fireboss.joinParty(partyId, user)
  }

  onPartyNameType(evt) {
    evt.preventDefault();
    const newPartyName = evt.target.value;
    this.setState({newPartyName});
  }

  onPartyLocationType(evt) {
    evt.preventDefault();
    const newPartyLocation = evt.target.value;
    this.setState({newPartyLocation});
  }

  onFailedValidation(msg) {
    this.setState(prevState => {
      return { validationMsgArr: prevState.validationMsgArr.concat(msg) };
    });
  }

  onDialogClose() {
    this.setState({dialogOpen: false, validationMsgArr: []});
  }

  toggleLogoutDialog() {
    this.setState(prevState => ({logoutDialogOpen: !prevState.logoutDialogOpen}));
  }

  handleLogout() {
    const { fireboss } = this.props;
    fireboss.auth.signOut();
  }

  onSubmit(evt) {
    evt.preventDefault();

    const { user, fireboss, parties } = this.props;

    // if a user starts the party, that party's uid becomes the partyId
    const partyId = user.uid;
    const name = this.state.newPartyName;
    const location = this.state.newPartyLocation;

    // check to see if name submitted is unique or not
    let duplicateName = false;
    for (let index in parties) {
      if (parties[index].name === name) {
        duplicateName = true;
      }
    }

    // custom validation to ensure that each party has a name and location
    if (!name || !location || duplicateName) {
      if (!name) {
        this.onFailedValidation('Your party needs a name!');
      }

      if (duplicateName) {
        this.onFailedValidation('That name is taken, please choose another!')
      }

      if (!location) {
        this.onFailedValidation('Your party needs a location!');
      }

      return this.setState({dialogOpen: true});
    }

    const partyObj = {name, location};

    fireboss.createPartyWithListeners(partyId, user, partyObj);
  }

  onPartySelect(autofillObj) {
    if (!autofillObj || !autofillObj.valueKey) return;
    this.setState({ partyId: autofillObj.valueKey });
  }

  render() {
    const name = this.props.user.displayName || 'Guest';
    return (
      <div>
        <DumbParties partyId={this.state.partyId}
                     onSubmit={this.onSubmit}
                     onPartySelect={this.onPartySelect}
                     createSickParty={this.createSickParty}
                     parties={this.props.parties}
                     joinParty={this.joinParty}
                     onPartyNameType={this.onPartyNameType}
                     onPartyLocationType={this.onPartyLocationType}
                     dialogOpen={this.state.dialogOpen}
                     validationMsg={this.state.validationMsgArr.join(' ')}
                     onDialogClose={this.onDialogClose}
                     name={name}
                     onLogout={this.handleLogout}
                     logoutDialogOpen={this.state.logoutDialogOpen}
                     toggleLogoutDialog={this.toggleLogoutDialog}
                     handleLogout={this.handleLogout}
                     />
      </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, fireboss, user }) => ({ parties, fireboss, user });


export default connect(mapStateToProps)(Parties);
