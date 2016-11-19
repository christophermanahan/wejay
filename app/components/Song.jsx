import React from 'react';

const Song = props => {
	const {title, artist, DJ} = props;
	return (
		<div style={{border:'1px solid black'}}>
			<p>{title}</p>
			<p>{artist}</p>
			<p>{DJ}</p>
		</div>
	)
}

export default Song;
