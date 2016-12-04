import React from 'react';
import IconButton from 'material-ui/IconButton';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Avatar from 'material-ui/Avatar';


/* -----------------    DUMB COMPONENT     ------------------ */

const Song = props => {
	const {title, artist, dj_name, onFire, onWater, id, rank, heatIndex, ownSong} = props;
	console.log("props in song: ", props);
	const iconStyle = {fontSize: '30px'};
	const buttonStyle = {paddingTop: '20px'}

	const heatColor = (heatIndex > 0) ?
             `rgba(236, 70, 22, ${heatIndex})` :
             `rgba(0, 188, 212, ${Math.abs(heatIndex)})`;

	//if songId is same as uid
	//disable buttons

	return (
		<Col xs={12}
				 className="top-ten-song"
				 style={{backgroundColor: heatColor}}
		>
			<Row>
				<Col xs={2} className="top-ten-col top-ten-rank">
					<Avatar
						color='#dae2df'
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
				      <IconButton disabled={ownSong} style={buttonStyle} iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={() => onWater(id)}/>
						</Col>
						<Col xs={6}>
				      <IconButton disabled={ownSong} style={buttonStyle} iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-up zmdi-hc-3x" onTouchTap={() => onFire(id)} />
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className="top-ten-dj">
				<Col xs={8} xsOffset={2}>
					<h4>chosen by: { dj_name }</h4>
				</Col>
			</Row>
		</Col>
	)
}

export default Song;
