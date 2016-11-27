import React, {Component} from 'react';
import { connect } from 'react-redux';

import {SelectField, MenuItem, RaisedButton, TextField} from 'material-ui';
import { Row, Col } from 'react-flexbox-grid/lib/index';

import {browserHistory} from 'react-router';

import { setCurrentParty } from '../ducks/currentParty';
import { setCurrentSong } from '../ducks/currentSong';
import { setTopTen } from '../ducks/topTen';
import { setDjs } from '../ducks/djs';
import { setPersonalQueue } from '../ducks/personalQueue';
import { setMessages } from '../ducks/chat';

import Fireboss from '../utils/fireboss'


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, partyId, onPartySelect, joinParty, onSubmit } = props;

  // partiesArr is an array with each index representing a party
  // each party has the following data [partyid, {name: '', location: ''}]
  let partiesArr = [];
  for (let index in parties) {
      partiesArr.push([index, parties[index]]);
  }

  return (
    <div>
      <h2 className="party-header">Join a Rager</h2>
      <Row>
        <SelectField
            floatingLabelText="Select a Sweet Party"
            value={partyId}
            onChange={onPartySelect}
          >
        {partiesArr && partiesArr.map(party => {
            return (<MenuItem key={party[0]}
                              value={party[0]}
                              primaryText={party[1].name}
                              secondaryText={party[1].location}
                              />)
          })
        }
        </SelectField>
      </Row>
      <RaisedButton
        className="party-btn"
        secondary={true}
        fullWidth={true}
        label="Rage"
        onTouchTap={joinParty}
      />
      <h2 className="party-header">Create a Rager</h2>
      <form onSubmit={onSubmit}>
        <TextField
          id="name"
          floatingLabelText="Party Name"
          />
        <TextField
          id="location"
          floatingLabelText="Party Location"
          />
        <RaisedButton
          className="party-btn"
          fullWidth={true}
          secondary={true}
          type="submit"
          label="Create Your Own"
        />
       </form>
    </div>
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
      partyId: ''
    };

  }


  joinParty(evt) {
    evt.preventDefault();
    const { user, firebase, setcurrentparty, setcurrentsong,
            settopten, setdjs, setpersonalqueue, setmessages } = this.props;
    const { partyId } = this.state;
    const fireboss = new Fireboss(firebase)

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
    const { user, firebase, setcurrentparty, setcurrentsong, settopten, setdjs,
            setpersonalqueue, setmessages } = this.props;
    const fireboss = new Fireboss(firebase)

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

  onPartySelect(evt, index, value) {
    const partyId = value;
    this.setState({ partyId });
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

const mapStateToProps = ({ parties, firebase, user }) => ({ parties, firebase, user });
const mapDispatchToProps = dispatch => ({
  setcurrentparty: party => dispatch(setCurrentParty(party)),
  setcurrentsong: song => dispatch(setCurrentSong(song)),
  settopten: topTen => dispatch(setTopTen(topTen)),
  setdjs: djs => dispatch(setDjs(djs)),
  setpersonalqueue: queue => dispatch(setPersonalQueue(queue)),
  setmessages: messages => dispatch(setMessages(messages))
});


export default connect(mapStateToProps, mapDispatchToProps)(Parties);
