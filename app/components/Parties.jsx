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
        return <MenuItem key={party[0]} value={party[0]} primaryText={party[1].name} secondaryText={party[1].location}/>
      })}
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
    const djPartiesRef = firebase.database().ref('dj_parties')
    const partyDjsRef = firebase.database().ref('party_djs')

    const {partyId} = this.state;
    if(!partyId) {
      return
    }
    partyDjsRef.child(partyId).child(user.uid).set({djPoints: 0, name: 'DJ Random'})

    djPartiesRef.child(user.uid).set(partyId, (err) => {
      if (err) {
        console.error(err);   //TODO: Add real error handling
      } else {
        browserHistory.push("/app/chat")
      }
    })
  }

  onSubmit(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const name = evt.target.name.value
    const location = evt.target.location.value

    const partiesRef = firebase.database().ref('parties')
    partiesRef.child(user.uid).set({name, location, needSong: false });

    // need to auto-join party and validate...
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
