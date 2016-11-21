import React, {Component} from 'react';
import { connect } from 'react-redux';

import {SelectField, MenuItem, RaisedButton} from 'material-ui';

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
  const { parties, createSickParty, value, handleChange, joinParty } = props

  // partiesArr is an array with each index representing a party
  // each party has the following data [partyid, {name: '', location: ''}]
  let partiesArr = [];
  for (let party in parties) {
      partiesArr.push([party, parties[party]]);
  }
  return (
    <div>
      <h1>Party Time</h1>
      <SelectField
          floatingLabelText="Select a Sweet Party"
          value={value}
          onChange={handleChange}
        >
      {partiesArr && partiesArr.map(party => {
        return <MenuItem value={party[0]} primaryText={party[1].name} secondaryText={party[1].location}/>
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
      value: '',
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
    djPartiesRef.child(user.uid).set(this.state.value);
  }



  handleChange = (event, index, value) => this.setState({value});

  render() {
    return (
      <div>
        <DumbParties value={this.state.value} handleChange={this.handleChange} createSickParty={this.createSickParty} parties={this.props.parties} joinParty={this.joinParty}/>
      </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, firebase, user }) => ({ parties, firebase, user });
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Parties);
