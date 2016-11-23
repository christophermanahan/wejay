import React, { Component } from 'react';
import { connect } from 'react-redux';

import HostPlayer from './HostPlayer';
import GuestPlayer from './GuestPlayer';
import Navbar from './Navbar';
import Chat from './Chat';
import Search from './Search';
import SongList from './SongList';
import { Tabs, Tab } from 'material-ui/Tabs';

import { Grid, Row, Col } from 'react-flexbox-grid';
// testing if Row and Col actually render




/* -----------------    COMPONENT     ------------------ */

const App = props => {
	const { uid, party_id } = props;
	return (
		<div>
      <Navbar />
	     <Tabs>
			   <Tab label="Top Ten" >
					<SongList />
			   </Tab>
			   <Tab label="Live DJs" >
					<Grid>
					<Row>
						<Col md={6}>
							<h3>Will be DJs</h3>
						</Col>
						<Col md={6}>
							<h3>Another Column</h3>
						</Col>
					</Row>
					</Grid>
			   </Tab>
			   <Tab label="My Tracks">
					<Search />
			   </Tab>
			   <Tab label="Chat">
					<Chat />
			   </Tab>
			 </Tabs>
      { (uid === party_id) ? <HostPlayer /> : <GuestPlayer /> }
    </div>
	)
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, currentParty }) => ({
	uid: user.uid,
	party_id: currentParty.id
});

export default connect(mapStateToProps)(App);
