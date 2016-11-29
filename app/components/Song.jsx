import React from 'react';
import IconButton from 'material-ui/IconButton';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Avatar from 'material-ui/Avatar';


/* -----------------    DUMB COMPONENT     ------------------ */

const Song = props => {
	const {title, artist, DJ, onFire, onWater, id, rank, heatIndex} = props;
	const iconStyle = {fontSize: '30px'};

	const heatColor = (heatIndex > 0) ?
             `rgba(236, 70, 22, ${heatIndex})` :
             `rgba(0, 188, 212, ${Math.abs(heatIndex)})`;

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
				      <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={() => onWater(id)}/>
						</Col>
						<Col xs={6}>
				      <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-fire zmdi-hc-3x" onTouchTap={() => onFire(id)} />
						</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	)
}

export default Song;

