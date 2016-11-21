import React, {Component} from 'react';
import { connect } from 'react-redux';

import {RaisedButton, TextField} from 'material-ui';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbParties = props => {
  const { parties, createSickParty } = props

  let partiesArr = [];
    for (let party in parties) {
        partiesArr.push(parties[party]);
    }
  return (
    <div>
      <h1>Party List</h1>
      {partiesArr && partiesArr.map(party => {
        return <p>{party.name}</p>
      })}
      <button onClick={ createSickParty }>Create Party</button>



    </div>
  );
};



/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class Parties extends Component {
  constructor(props) {
    super(props);
    this.createSickParty = this.createSickParty.bind(this);

  }

  createSickParty(evt) {
    evt.preventDefault();
    const { user, firebase } = this.props;
    const partiesRef = firebase.database().ref('parties')
    partiesRef.child(user.uid).set({name: 'swag party', location: 'fullstack'});
  }

  render() {
    return (
        <div>
          <DumbParties createSickParty={this.createSickParty} parties={this.props.parties} />
        </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ parties, firebase, user }) => ({ parties, firebase, user });
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Parties);
