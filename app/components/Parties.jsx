import React, {Component} from 'react';
import { connect } from 'react-redux';

import {MenuItem, RaisedButton, TextField, List, ListItem, Checkbox, AutoComplete} from 'material-ui';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import {browserHistory} from 'react-router';

import { setCurrentParty } from '../ducks/currentParty';
import { setCurrentSong } from '../ducks/currentSong';
import { setTopTen } from '../ducks/topTen';
import { setDjs } from '../ducks/djs';
import { setPersonalQueue } from '../ducks/personalQueue';
import { setMessages } from '../ducks/chat';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, partyId, onPartySelect, joinParty, onSubmit } = props;

  //override material ui's inline style elements
  let btnStyle = {
    minWidth: "50%"
  };

  let textFieldStyle = {
    color: "#363836",
    width: "98%",
    margin: "0.2em"
  }

  let listItemStyle = {}

  let nestedListItemStyle = {
    right: "0.8em"
  }

  // partiesArr is an array with each index representing a party
  // each party has the following data [partyid, {name: '', location: ''}]

  let autofillArr = [];

  for (let index in parties) {
    autofillArr.push({textKey: parties[index].name, valueKey: parties[index].id});
  }

  const autofillConfig = {
    text: 'textKey',
    value: 'valueKey'
  }

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
            <h2 className="party-header">Join</h2>
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
            <h2 className="party-header">Create</h2>
            <form onSubmit={onSubmit}>
              <TextField
                id="name"
                style={textFieldStyle}
                floatingLabelText="Party Name"
                />
              <TextField
                id="location"
                style={textFieldStyle}
                floatingLabelText="Party Location"
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
    this.state = {
      partyId: '',
      open: false
    };

  }

  joinParty(evt) {
    console.log('also here')
    evt.preventDefault();
    const { user, fireboss, setcurrentparty, setcurrentsong,
            settopten, setdjs, setpersonalqueue, setmessages } = this.props;
    const { partyId } = this.state;

    if (!partyId) { return; }

    const associatingPartyAndUser = fireboss.associatingPartyAndUser(partyId, user)
    const addingPartyDJ = fireboss.addingPartyDJ(partyId, user)

    Promise.all([associatingPartyAndUser, addingPartyDJ])
      .then(() => {
          fireboss.getCurrentPartySnapshot(partyId, setcurrentparty)
          fireboss.createPartyListener(partyId,'current_song', setcurrentsong)
          fireboss.createPartyListener(partyId,'top_ten', settopten)
          fireboss.createPartyListener(partyId,'party_djs', setdjs)
          fireboss.createPersonalQueueListener(partyId, user, setpersonalqueue)
          fireboss.createMessagesListener(setmessages)
          browserHistory.push('/app');
      })
      .catch(err => console.error(err)) // TODO: need real error handling
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { user, fireboss, setcurrentparty, setcurrentsong, settopten, setdjs,
            setpersonalqueue, setmessages } = this.props;

    // if a user starts the party, that party's uid becomes the partyId
    const partyId = user.uid
    const name = evt.target.name.value;
    const location = evt.target.location.value;

    const partyObj = {id: user.uid, name, location, needSong: false }
    const initialSong = {uid: user.uid, dj_name: 'DJ Init', artist: 'dazzel-almond',
                         title: 'Melody of Lies',
                         song_uri: 'https://soundcloud.com/dazzel-almond/melody-of-lies',
                         time_priority: 0,
                         vote_priority: 0
                       }

    fireboss.creatingParty(partyId, partyObj)
      .then(() => {
        const addingHostDJ = fireboss.addingPartyDJ(partyId, user)
        const associatingPartyAndHost = fireboss.associatingPartyAndUser(partyId, user)
        const settingCurrentSong = fireboss.settingCurrentSong(partyId, initialSong)

        Promise.all([addingHostDJ, associatingPartyAndHost, settingCurrentSong])
          .then(() => {
            fireboss.getCurrentPartySnapshot(partyId, setcurrentparty)
            fireboss.createPartyListener(partyId,'current_song', setcurrentsong)
            fireboss.createPartyListener(partyId,'top_ten', settopten)
            fireboss.createPartyListener(partyId,'party_djs', setdjs)
            fireboss.createPersonalQueueListener(partyId, user, setpersonalqueue)
            fireboss.createMessagesListener(setmessages)
            browserHistory.push('/app');
          })
          .catch(console.error) // TODO: real error handling
      });
  }

  onPartySelect(autofillObj) {
    if(!autofillObj || !autofillObj.valueKey) return;
    this.setState({ partyId : autofillObj.valueKey });
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
                     />
      </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, fireboss, user }) => ({ parties, fireboss, user });
const mapDispatchToProps = dispatch => ({
  setcurrentparty: party => dispatch(setCurrentParty(party)),
  setcurrentsong: song => dispatch(setCurrentSong(song)),
  settopten: topTen => dispatch(setTopTen(topTen)),
  setdjs: djs => dispatch(setDjs(djs)),
  setpersonalqueue: queue => dispatch(setPersonalQueue(queue)),
  setmessages: messages => dispatch(setMessages(messages))
});


export default connect(mapStateToProps, mapDispatchToProps)(Parties);



/*
<Row>
  <List style={textFieldStyle}>
    <ListItem
      primaryText="Parties"
      style={listItemStyle}
      initiallyOpen={false}
      primaryTogglesNestedList={true}
      nestedItems={
        partiesArr && partiesArr.map(party => {
          return (
            <MenuItem
              onClick={() => onPartySelect(party[0])}
              style={nestedListItemStyle}
              key={party[0]}
              primaryText={party[1].name}
              secondaryText={party[1].location}
              />)
            })
          }
          />
      </List>
    </Row>
*/
