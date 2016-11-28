import React, { Component } from 'react';
import { connect } from 'react-redux';

import HostPlayer from './HostPlayer';
import GuestPlayer from './GuestPlayer';
import Navbar from './Navbar';
import Chat from './Chat';
import Search from './Search';
import SongList from './SongList';
import Djs from './Djs';
import { Tabs, Tab } from 'material-ui/Tabs';

import { Row, Col } from 'react-flexbox-grid/lib/index';


/* -----------------    COMPONENT     ------------------ */

const App = props => {
	const { uid, party_id } = props;


//override material ui's inline style elements
	let tabsStyle = {
    fontSize: "40px",
		marginBottom: "20px",
		marginTop: "20px"
  };

	let navBarStyle = {
    paddingBottom: "100px"
  };

	let selectTabInkBarStyle = {
		backgroundColor:"#EC4616",
		height: "12px"
	}

	return (
		<div style={navBarStyle}>
			<Row>
				<Col xs={12}>
		      <Navbar />
	      </Col>
	    </Row>
	    <Row>
				<Col xs={12}>
		     <Tabs inkBarStyle={selectTabInkBarStyle}>
				   <Tab style={tabsStyle} label="Top Ten" >
						<SongList />
				   </Tab>
				   <Tab style={tabsStyle} label="Live DJs" >
							<Djs />
				   </Tab>
				   <Tab style={tabsStyle} label="My Tracks">
						<Search />
				   </Tab>
				   <Tab style={tabsStyle} label="Chat">
						<Chat />
				   </Tab>
				 </Tabs>
				</Col>
			</Row>
			<Row className="both-player-container" bottom="xs">
				<Col xs={12}>
		      { (uid === party_id) ? <HostPlayer /> : <GuestPlayer /> }
	      </Col>
	    </Row>
    </div>
	)
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, currentParty }) => ({
	uid: user.uid,
	party_id: currentParty.id
});

export default connect(mapStateToProps)(App);
