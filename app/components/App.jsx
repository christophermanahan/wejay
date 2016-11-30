import React, { Component } from 'react';
import { connect } from 'react-redux';

import HostPlayer from './HostPlayer';
import GuestPlayer from './GuestPlayer';
import Navbar from './Navbar';
import MySongs from './MySongs';
import Search from './Search';
import SongList from './SongList';
import Djs from './Djs';
import { Tabs, Tab } from 'material-ui/Tabs';

import { Row, Col } from 'react-flexbox-grid/lib/index';


/* -----------------    COMPONENT     ------------------ */

const App = props => {
	const { uid, party_id } = props;

	const selectTabInkBarStyle = {
		backgroundColor:"#EC4616",
		height: ".3em"
	};

	return (
		<Row className="app-no-margin">
			<Col xs={12}>
				<Row id="app-nav-row">
					<Col xs={12}>
			      <Navbar />
		      </Col>
		    </Row>
		    <Row>
					<Col xs={12} className="app-no-margin">
			     <Tabs inkBarStyle={selectTabInkBarStyle}>
					   <Tab label="Top Ten" >
							<SongList />
					   </Tab>
					   <Tab label="Live DJs" >
								<Djs />
					   </Tab>
					   <Tab label="Add Song">
							<Search />
					   </Tab>
					   <Tab label="My Songs">
							<MySongs />
					   </Tab>
					 </Tabs>
					</Col>
				</Row>
				<Row className="both-player-container" bottom="xs">
					<Col xs={12}>
			      { (uid === party_id) ? <HostPlayer /> : <GuestPlayer /> }
		      </Col>
		    </Row>
	    </Col>
    </Row>
	)
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, currentParty }) => ({
	uid: user.uid,
	party_id: currentParty.id
});

export default connect(mapStateToProps)(App);
