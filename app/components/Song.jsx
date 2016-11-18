import React from 'react';

const Song = props => {
	const {name, artist, DJ} = props;
	return (
		<div style={{border:'1px solid black'}}>
			<p>{name}</p>
			<p>{artist}</p>
			<p>{DJ}</p>
		</div>
	)
}

export default Song;