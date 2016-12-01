import React, {Component} from 'react';
import { connect } from 'react-redux';

import { RaisedButton, TextField, AutoComplete, Dialog} from 'material-ui';

import { Row, Col } from 'react-flexbox-grid/lib/index';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, onPartySelect, joinParty, onSubmit, onPartyNameType, onPartyLocationType,
        dialogOpen, validationMsg, onDialogClose } = props;

  //override material ui's inline style elements
  let btnStyle = {
    minWidth: "50%"
  };

  let textFieldStyle = {
    color: "#363836",
    width: "98%",
    margin: "0.2em"
  };


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
            >
              { validationMsg }
            </Dialog>
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

    this.state = {
      partyId: '',
      newPartyName: '',
      newPartyLocation: '',
      dialogOpen: false,
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

    const partyObj = {id: user.uid, name, location, needSong: false, active: true };

    fireboss.createPartyWithListeners(partyId, user, partyObj);
  }

  onPartySelect(autofillObj) {
    if (!autofillObj || !autofillObj.valueKey) return;
    this.setState({ partyId: autofillObj.valueKey });
  }

  render() {
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
                     />
      </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, fireboss, user }) => ({ parties, fireboss, user });


export default connect(mapStateToProps)(Parties);
