import React, {Component} from 'react';
import { connect } from 'react-redux';

import {SelectField, MenuItem, RaisedButton, TextField} from 'material-ui';

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
    this.onPartySelect = this.onPartySelect.bind(this);
    this.joinParty = this.joinParty.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      partyId: ''
    };

  }


  joinParty(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const database = firebase.database();
    const userPartiesRef = database.ref('user_parties');
    const partyDjsRef = database.ref('party_djs');

    const { partyId } = this.state;
    if (!partyId) {
      return;
    }
    const userParty = userPartiesRef.child(user.uid).set(partyId);
    // TODO: set actual DJ Name based on entry in Firebase DB
    const partyDjs = partyDjsRef.child(partyId).child(user.uid)
    .set({
      dj_points: 0,
      dj_name: `DJ ${user.displayName || 'Rando'}`,
      personal_queue: {}
    });

    const { setcurrentparty, setcurrentsong, settopten, setdjs, setpersonalqueue, setmessages } = this.props;
    const { uid } = user;
    // link the user to a DJ alibi and a party id, then navigate to the app
    Promise.all([userParty, partyDjs])
      .then(() => {

        // Add listeners to relevant party info

          // get the party stats once
          database.ref('parties').child(partyId).once('value', snapshot => {
            setcurrentparty(snapshot.val());
          });

          // set up listeners for state
          database.ref('current_song').child(partyId).on('value', snapshot => {
            setcurrentsong(snapshot.val());
          });
          database.ref('top_ten').child(partyId).on('value', snapshot => {
            settopten(snapshot.val());
          });
          database.ref('party_djs').child(partyId).on('value', snapshot => {
            setdjs(snapshot.val()); // updates entire party_djs in store
            setpersonalqueue(snapshot.val()[uid].personal_queue); // updates personal queue
          });
          database.ref('messages').on('value', snapshot => {
            setmessages(snapshot.val());
          });

          browserHistory.push('/app');
      })
      .catch(err => console.error(err)) // TODO: need real error handling
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const database = firebase.database();
    const name = evt.target.name.value;
    const location = evt.target.location.value;
    const { uid } = user;

    const partiesRef = database.ref('parties');
    const userPartiesRef = database.ref('user_parties');
    const partyDjsRef = database.ref('party_djs');
    const currentSongRef = database.ref('current_song');

    const { setcurrentparty, setcurrentsong, settopten, setdjs, setpersonalqueue, setmessages } = this.props;


    // sets up a new party
    partiesRef.child(uid).set({id: uid, name, location, needSong: false })
      .then(() => {
        // associates the host with the party
        const hostParty = userPartiesRef.child(uid).set(uid)
        const hostDjs = partyDjsRef.child(uid).child(uid)
        .set({
          dj_points: 0,
          dj_name: `DJ ${user.displayName || 'Rando'}`,
          personal_queue: {}
        });

        // give every party an awesome initial song
        const currentSong = currentSongRef.child(uid)
        .set({
          uid,
          dj_name: 'DJ Init',
          artist: 'dazzel-almond',
          title: 'Melody of Lies',
          song_uri: 'https://soundcloud.com/dazzel-almond/melody-of-lies',
          time_priority: 0,
          vote_priority: 0
        });

        Promise.all([hostParty, hostDjs, currentSong])
          .then(() => {

            const partyId = uid     //if a user starts the party, that party's uid becomes the partyId

            // get the party stats once
            database.ref('parties').child(partyId).once('value', snapshot => {
              setcurrentparty(snapshot.val());
            });

            // set up listeners for state
            database.ref('current_song').child(partyId).on('value', snapshot => {
              setcurrentsong(snapshot.val());
            });
            database.ref('top_ten').child(partyId).on('value', snapshot => {
              settopten(snapshot.val());
            });
            database.ref('party_djs').child(partyId).on('value', snapshot => {
              setdjs(snapshot.val()); // updates entire party_djs in store
              const personalQueue = snapshot.val()[uid].personal_queue || {};
              setpersonalqueue(personalQueue); // updates personal queue
            });
            database.ref('messages').on('value', snapshot => {
              setmessages(snapshot.val());
            });

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
