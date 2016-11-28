import React from 'react';
import IconButton from 'material-ui/IconButton';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Avatar from 'material-ui/Avatar';
import {cyan500} from 'material-ui/styles/colors';



/* -----------------    DUMB COMPONENT     ------------------ */

const Song = props => {
	const {title, artist, DJ, onFire, onWater, id, rank} = props;
	return (
		<Col xs={12} className="top-ten-song">
			<Row>
				<Col xs={2} className="top-ten-col top-ten-rank">
					<Avatar
						color='#ec4616'
						backgroundColor='#363836'
					>
						{rank}
					</Avatar>
				</Col>
				<Col xs={7}>
					<h3>{title}</h3>
					<h4>{artist}</h4>
				</Col>
				<Col xs={3} className="top-ten-col">
					<Row>
						<Col xs={6}>
				      <IconButton iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={() => onWater(id)}/>
						</Col>
						<Col xs={6}>
				      <IconButton iconClassName="zmdi zmdi-fire zmdi-hc-3x" onTouchTap={() => onFire(id)} />
						</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	)
}

export default Song;


/*
    <div>
			<ListItem
				primaryText={title}
				secondaryText={artist}
				leftAvatar={artwork_url ? <Avatar src={artwork_url}/> : <Avatar color={cyan500} backgroundColor='#363836' icon={<Audiotrack />}/>}
				rightIcon={<PlaylistAdd style={{height: '40px', width: '40px'}} color='#363836' />}
				onTouchTap={ () => addToQueue(permalink_url, title, artist, artwork_url) }
			/>
    </div>



    		<div style={{border: '1px solid black'}}>
			<p>Rank: #{rank} - {title}</p>
			<p>{artist}</p>
			<p>{DJ}</p>
      <IconButton iconClassName="zmdi zmdi-fire" onTouchTap={() => onFire(id)} />
      <IconButton iconClassName="zmdi zmdi-thumb-down" onTouchTap={() => onWater(id)}/>
		</div>

    */