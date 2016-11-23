import React, { Component } from 'react';
import { connect } from 'react-redux';

import HostPlayer from './HostPlayer';
import GuestPlayer from './GuestPlayer';
import Navbar from './Navbar';


/* -----------------    COMPONENT     ------------------ */

const App = props => {
  const { children, uid, party_id } = props;
  return (
      <div>
        <h1>bones has been gutted.</h1>
        <Navbar/>
          { children }
        { (uid === party_id) ? <HostPlayer /> : <GuestPlayer /> }
      </div>
  );
};


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, currentParty }) => ({
	uid: user.uid,
	party_id: currentParty.id
});

export default connect(mapStateToProps)(App);
