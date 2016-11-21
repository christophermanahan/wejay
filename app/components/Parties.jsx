import React, {Component} from 'react';
import { connect } from 'react-redux';

import {SelectField, MenuItem, RaisedButton} from 'material-ui';

import {browserHistory} from 'react-router'

const styles = {
  customWidth: {
    width: 150,
  },
};

const style = {
  margin: 12,
};




/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, createSickParty, partyId, handleChange, joinParty } = props

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
          onChange={handleChange}
        >
      {partiesArr && partiesArr.map(party => {
        return <MenuItem key={party[0]} value={party[0]} primaryText={party[1].name} secondaryText={party[1].location}/>
      })}
      </SelectField>
      <RaisedButton label="Rage" style={style} onTouchTap={joinParty}/>


      <button onClick={ createSickParty }>Create New Party</button>



    </div>
  );
};



/* -----------------    STATEFUL REACT COMPONENT     ------------------ */
class Parties extends Component {
  constructor(props) {
    super(props);
    this.createSickParty = this.createSickParty.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.joinParty = this.joinParty.bind(this)
    this.state = {
      partyId: '',
    };

  }


  createSickParty(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const partiesRef = firebase.database().ref('parties')
    partiesRef.child(user.uid).set({name: 'swag party', location: 'fullstack'});
  }

  joinParty(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const djPartiesRef = firebase.database().ref('djParties')

    const {partyId} = this.state;
    if(!partyId) {
      return
    }

    djPartiesRef.child(user.uid).set(partyId, (err) => {
      if (err) {
        console.error(err);   //TODO: Add real error handling
      } else {
        browserHistory.push("/app/chat")
      }
    })
  }



  handleChange = (event, index, partyId) => this.setState({partyId});

  render() {
    return (
      <div>
        <DumbParties partyId={this.state.partyId} handleChange={this.handleChange} createSickParty={this.createSickParty} parties={this.props.parties} joinParty={this.joinParty}/>
      </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, firebase, user }) => ({ parties, firebase, user });
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Parties);
