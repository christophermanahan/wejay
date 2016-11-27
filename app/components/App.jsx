import React, { Component } from 'react';
import { connect } from 'react-redux';

import HostPlayer from './HostPlayer';
import GuestPlayer from './GuestPlayer';
import Navbar from './Navbar';
import Chat from './Chat';
import Search from './Search';
import SongList from './SongList';
import Djs from './djs'
import { Tabs, Tab } from 'material-ui/Tabs';

import { Row, Col } from 'react-flexbox-grid/lib/index';




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
						<Djs />
			   </Tab>
			   <Tab label="My Tracks">
					<Search />
			   </Tab>
			   <Tab label="Chat">
					<Chat />
			   </Tab>
			 </Tabs>
			 <div className="both-player-container">
				 <Row bottom="xs">
					 <Col xs="12">
						 { (uid === party_id) ? <HostPlayer /> : <GuestPlayer /> }
					 </Col>
				 </Row>
			 </div>
    </div>
	)
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, currentParty }) => ({
	uid: user.uid,
	party_id: currentParty.id
});

export default connect(mapStateToProps)(App);
