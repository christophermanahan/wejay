import React, {Component} from 'react';
import { connect } from 'react-redux';

import {SelectField, MenuItem, RaisedButton, TextField} from 'material-ui';

import {browserHistory} from 'react-router'


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, partyId, onPartySelect, joinParty, onSubmit } = props

  // partiesArr is an array with each index representing a party
  // each party has the following data [partyid, {name: '', location: ''}]
  let partiesArr = [];
  for (let index in parties) {
      partiesArr.push([index, parties[index]]);
  }

  return (
    <div>
      <h1>Party Time</h1>
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
      <RaisedButton label="Rage" onTouchTap={joinParty}/>
      <h1>OR...</h1>
      <form onSubmit={onSubmit}>
        <TextField
          id="name"
          floatingLabelText="Party Name"
          />
        <TextField
          id="location"
          floatingLabelText="Party Location"
          />
        <RaisedButton type="submit" label="Create Your Own"/>
       </form>
    </div>
  );
};



/* -----------------    STATEFUL REACT COMPONENT     ------------------ */
class Parties extends Component {
  constructor(props) {
    super(props);
    this.onPartySelect = this.onPartySelect.bind(this)
    this.joinParty = this.joinParty.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      partyId: ''
    };

  }


  joinParty(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const userPartiesRef = firebase.database().ref('user_parties')
    const partyDjsRef = firebase.database().ref('party_djs')

    const {partyId} = this.state;
    if(!partyId) {
      return
    }
    const userParty = userPartiesRef.child(user.uid).set(partyId)
    const partyDjs = partyDjsRef.child(partyId).child(user.uid).set({djPoints: 0, name: 'DJ Random'})

    // link the user to a DJ alabi and a party id, then navigate to the app
    Promise.all([userParty, partyDjs])
      .then(() => {
        browserHistory.push("/app/search")
      })
      .catch(err => console.error(err)) // need real error handling
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const name = evt.target.name.value
    const location = evt.target.location.value

    const partiesRef = firebase.database().ref('parties')
    const userPartiesRef = firebase.database().ref('user_parties')
    const partyDjsRef = firebase.database().ref('party_djs')
    const currentSongRef = firebase.database().ref('current_song')

    // sets up a new party
    partiesRef.child(user.uid).set({id:user.uid, name, location, needSong: false })
      .then(() => {
        // associates the host with the party
        const hostParty = userPartiesRef.child(user.uid).set(user.uid)
        const hostDjs = partyDjsRef.child(user.uid).child(user.uid).set({djPoints: 0, name: 'DJ Host'})

        // give every party an awesome initial song
        const currentSong = currentSongRef.child(user.uid).set({DJ: 'DJ Init',
                                                        artist: 'dazzel-almond',
                                                        sc_id: 107781328,
                                                        song_uri: 'https://soundcloud.com/dazzel-almond/melody-of-lies',
                                                        title: 'Melody of Lies'
                                                      })

        Promise.all([hostParty, hostDjs, currentSong])
          .then(() => {
            browserHistory.push("/app/search")
          })
      })
  }

  onPartySelect = (event, index, partyId) => this.setState({partyId});

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
});

export default connect(mapStateToProps, mapDispatchToProps)(Parties);
