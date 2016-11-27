import React from 'react';
import IconButton from 'material-ui/IconButton';

const Song = props => {
	const {title, artist, DJ, onFire, onWater, id, rank} = props;
	return (
		<div style={{border:'1px solid black'}}>
			<p>Rank: #{rank} - {title}</p>
			<p>{artist}</p>
			<p>{DJ}</p>
      <IconButton iconClassName="zmdi zmdi-fire" onTouchTap={()=>onFire(id)} />
      <IconButton iconClassName="zmdi zmdi-thumb-down" onTouchTap={()=>onWater(id)}/>
		</div>
	)
}

export default Song;
