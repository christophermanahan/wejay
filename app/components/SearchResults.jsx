import React, { Component } from 'react';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import PlaylistAdd from 'material-ui/svg-icons/av/playlist-add';
import Audiotrack from 'material-ui/svg-icons/image/audiotrack';


import {cyan500} from 'material-ui/styles/colors';

/* -----------------    DUMB COMPONENTS     ------------------ */

const SingleSong = props => {
  const { title, permalink_url, artist, addToQueue, artwork_url } = props;
  return (
    <div>
			<ListItem
				primaryText={title}
				secondaryText={artist}
				leftAvatar={artwork_url ? <Avatar src={artwork_url}/> : <Avatar color={cyan500} backgroundColor='#363836' icon={<Audiotrack />}/>}
				rightIcon={<PlaylistAdd style={{height: '40px', width: '40px'}} color='#363836' />}
				onTouchTap={ () => addToQueue(permalink_url, title, artist, artwork_url) }
			/>
    </div>
  );
};


const SearchResults = props => {
	const { searchResults, addToQueue } = props;
  return (
    <div>
			<List>
      { searchResults && searchResults.map(song => (

        <SingleSong
					addToQueue={addToQueue}
					title={song.title}
					key={song.id}
					artwork_url={song.artwork_url}
					permalink_url={song.permalink_url}
					artist={song.user.username}
        />
      ))}
      </List>
    </div>
  );
};

export default SearchResults;
